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
  private static hasListener: boolean;

  public constructor(widget: ICardWidget, sourceBucket: BucketModel, targetBucket: BucketModel, drawBucket: BucketModel) {
    this.widget = widget;
    this.sourceBucket = sourceBucket;
    this.targetBucket = targetBucket;
    this.drawBucket = drawBucket;
  }

  public static addCanvasListener() {
    if (POModel.hasListener) {
      return;
    }
    miro.addListener('CANVAS_CLICKED', POModel.checkCanvas);
    POModel.hasListener = true;
  }

  public static hasCanvasListener() {
    return POModel.hasListener;
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

  // todo based on event, detect,which primitive has been changed
  public static async checkCanvas() {
    const widgets = await miro.board.widgets.get();
    const ownerId = POModel.getOwnerId(widgets);

    await POModel.checkIfSourceBucketHasEnoughBalls(widgets);
    const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);

    if (areBucketsOverFlow) {
      await BucketModel.resetBucketsPosition(0, 0, widgets);
    }

    for (const widget of widgets) {

      if (widget.metadata && widget.metadata[config.appId].formType === formType.bucket) {
        await POModel.checkBucketProportions(widget);
      }

      if (
        widget.metadata &&
        widget.metadata[config.appId] &&
        widget.metadata[config.appId].formType === formType.ball
      ) {
        if (widget.metadata[config.appId].owner === ownerId) {
          await BallModel.checkBallProportions(widget as any);
          await POModel.checkOwnBallPosition(ownerId, widget as any, widgets);
        }

        if (widget.metadata[config.appId].owner !== ownerId && widget.lastModifiedUserId === ownerId) {
          await POModel.checkWrongMovedBallPosition(ownerId, widget as any, widgets);
        }
      }
    }
  }

  public static async checkBucketProportions(bucket: any) {
    if (bucket.height !== config.bucket.widthHeight || bucket.width !== config.bucket.widthHeight) {
      await BucketModel.resetProportions(bucket);
    }
  }

  private static async checkIfSourceBucketHasEnoughBalls(widgets: IWidget[]) {
    const sourceBucket = BucketModel.get(bucketType.source, widgets);
    const sourceBucketMeta = BucketModel.getMeta(bucketType.source, widgets);
    const ballsInSourceBucket = BallModel.getBucketBalls(bucketType.source, widgets);
    for (let i = 0; i <= (config.balls.initialAmount - ballsInSourceBucket.length); i++) {
      await BallModel.create(sourceBucket.x, sourceBucket.y, sourceBucketMeta.owner, 1, colors.ball, BucketType.source);
    }
  }

  private static async checkOwnBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]) {
    const ballMeta = BallModel.getMeta(ball);

    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets);
    const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets);

    if (userCardWithBall && ball.lastModifiedUserId !== userId) {
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

    if (userCardWithBall) {

      const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets)

      if (userCardWithBall &&
        allUserBallsCount > config.rules.memberBallLimit) {
        console.log('user reached limit in balls. Moving to draw bucket')
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
        return;
      }

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

  public static async checkWrongMovedBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]) {
    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets);

    if (!userCardWithBall || userCardWithBall.metadata[config.appId].owner !== ball.metadata[config.appId].owner) {
      // console.log(userCardWithBall, userCardWithBall.metadata[config.appId].owner, widget.metadata[config.appId].owner)
      console.log('out of user card!!')
      BallModel.destroy(ball as any);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
    }
  }

  public static async stopTrack() {

    const widgets = await miro.board.widgets.get();
    const filtered = widgets.filter(w => w.metadata[config.appId]);

    for (const widget of filtered) {
      await miro.board.widgets.deleteById([widget.id])
    }

    miro.removeListener('CANVAS_CLICKED', POModel.checkCanvas);
    POModel.hasListener = false;
  }

}
