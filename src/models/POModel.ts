import ICardWidget = SDK.ICardWidget;
import IWidget = SDK.IWidget;
import IShapeWidget = SDK.IShapeWidget;
import formType from '../static/formType';
import colors from '../static/colors';
import BucketModel from './BucketModel';
import BucketType from '../static/bucketType';
import bucketType from '../static/bucketType';
import config from '../config/index';
import BallModel from './BallModel';
import UserModel from './UserModel';

export default class POModel {

  private readonly widget: ICardWidget;
  public readonly sourceBucket: BucketModel;
  public readonly targetBucket: BucketModel;
  public readonly drawBucket: BucketModel;
  public static isGameRunning = false;

  public constructor(widget: ICardWidget, sourceBucket: BucketModel, targetBucket: BucketModel, drawBucket: BucketModel) {
    this.widget = widget;
    this.sourceBucket = sourceBucket;
    this.targetBucket = targetBucket;
    this.drawBucket = drawBucket;
  }

  public static async create(userId, username, x, y, widgets: IWidget[]): Promise<void> {

    const buckets = [
      {
        type: BucketType.source,
        color: colors.sourceBucket,
        x,
        y,
        text: ''
      },
      {
        type: BucketType.target,
        color: colors.targetBucket,
        x: x + config.bucket.widthHeight + 100,
        y,
        text: '0'
      },
      {
        type: BucketType.draw,
        color: colors.drawBucket,
        x: x + (config.bucket.widthHeight + 100) * 2,
        y,
        height: config.bucket.widthHeight,
        width: config.bucket.widthHeight,
        text: '0'
      }
    ];

    for (const bucket of buckets) {
      let b = BucketModel.get(bucket.type, widgets);
      if (!b) {
        await BucketModel.create(bucket.type, bucket.x, bucket.y, bucket.color, userId);
      }
    }

    await miro.board.widgets.create({
      type: 'card',
      title: `game PO: ${ username }`,
      x: x - config.bucket.widthHeight - 100,
      y: y + config.card.height + config.card.height / 2,
      metadata: {
        [config.appId]: {
          gamePO: userId,
          formType: formType.card
        }
      }
    });


    for (let i = 0; i < config.balls.initialAmount; i++) {
      await BallModel.create(buckets[0].x, buckets[0].y, userId, i, colors.ball, buckets[0].type)
    }

  }

  public static getOwnerId(widgets: IWidget[]): string | null {
    const bucketMeta = BucketModel.getMeta(BucketType.source, widgets);
    return bucketMeta ? bucketMeta.owner : null;
  }

  public static async isCurrentUserPO(widgets: IWidget[]) {
    const currentUserId = await miro.currentUser.getId();
    const latestOwnerId = POModel.getOwnerId(widgets);
    return latestOwnerId === currentUserId;
  }

  public static async trackChanges(userId: string) {
    POModel.isGameRunning = true;

    while (POModel.isGameRunning) {

      const widgets = await miro.board.widgets.get();
      const ownerId = POModel.getOwnerId(widgets);

      if (ownerId !== userId) {
        UserModel.isGameRunning = false;
        return;
      }

      await POModel.checkIfSourceBucketHasEnoughBalls(widgets);
      const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);

      if (areBucketsOverFlow) {
        await BucketModel.resetBucketsPosition(0, 0, widgets);
      }

      for (const widget of widgets) {

        if (widget.metadata && widget.metadata[config.appId].formType === formType.bucket) {
          await this.checkBucketProportions(widget);
        }

        if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.ball && widget.metadata[config.appId].owner === userId) {
          await BallModel.checkBallProportions(widget as any);
          await this.checkBallPosition(userId, widget as any, widgets);
        }
      }

      await new Promise(res => setTimeout(res, 500));
    }
  }

  private static async checkBucketProportions(bucket: any) {
    if (bucket.height !== config.bucket.widthHeight || bucket.width !== config.bucket.widthHeight) {
      await BucketModel.resetProportions(bucket);
    }
  }

  private static async checkIfSourceBucketHasEnoughBalls(widgets: IWidget[]){
    const sourceBucket = BucketModel.get(bucketType.source, widgets);
    const sourceBucketMeta = BucketModel.getMeta(bucketType.source, widgets);
    const ballsInSourceBucket = BallModel.getBucketBalls(bucketType.source, widgets);
    for (let i = 0; i <= (config.balls.initialAmount - ballsInSourceBucket.length); i++) {
      await BallModel.create(sourceBucket.x, sourceBucket.y, sourceBucketMeta.owner, 1, colors.ball, BucketType.source);
    }
  }

  private static async checkBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]) {
    const ballMeta = BallModel.getMeta(ball);

    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets);
    const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets);

    if (userCardWithBall && ball.lastModifiedUserId !== userId) {
      ballMeta.bucketType = BucketType.draw;
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return
    }

    const usersWidgets = UserModel.getAllCreatedUsers(widgets);// todo replace with enum
    const isInTargetBucket = BucketModel.isBallInBucket(BucketType.target, ball, widgets);

    if (isInTargetBucket && usersWidgets.length > ballMeta.participatedUserIds.length) {
      console.log('not all peers touched balls');
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return;
    }

    if (isInTargetBucket && usersWidgets.length === ballMeta.participatedUserIds.length) {
      console.log('move ball to target');
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.target, widgets, targetBucketMeta.ballsCount + 1)
      return;
    }


    const isInSourceBucket = BucketModel.isBallInBucket(BucketType.source, ball, widgets);
    const isInDrawBucket = BucketModel.isBallInBucket(BucketType.draw, ball, widgets);

    if (!isInDrawBucket && ballMeta.bucketType === bucketType.draw) {
      ballMeta.bucketType = BucketType.draw;
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return;
    }

    // todo check if ball has been moved to user card. If so - update owner. But if everybody touched the ball - it should be moved back to draw
    if (userCardWithBall) {
      //todo if all touched the ball - then move to draw, otherwise assign new owner to ball
      ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
      ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
      ballMeta.bucketType = null;
      BallModel.updateMeta(ball, ballMeta);
      return
    }


    if (!userCardWithBall && !isInSourceBucket && !isInTargetBucket) {
      console.log('outside of all cards');
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return;
    }


  }

  public static async stopTrack(){

    const widgets = await miro.board.widgets.get();
    const filtered = widgets.filter(w=> w.metadata[config.appId]);

    for(const widget of filtered){
      await miro.board.widgets.deleteById([widget.id])
    }

    POModel.isGameRunning = false;

  }

}
