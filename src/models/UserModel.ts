import IStickerWidget = SDK.IStickerWidget;
import IWidget = SDK.IWidget;
import IShapeWidget = SDK.IShapeWidget;
import FormType from '../static/formType';
import config from '../config/index';
import colors from '../static/colors';
import BucketType from '../static/bucketType';
import BucketModel from './BucketModel';
import formType from '../static/formType';
import BallModel from './BallModel';
import POModel from './POModel';
import bucketType from '../static/bucketType';
import CommonUserModel from './CommonUserModel';

interface Meta {
  owner: string,
  formType: FormType.userSticker
}

export default class UserModel extends CommonUserModel {

  public readonly widget: IStickerWidget;

  constructor(widget) {
    super();
    this.widget = widget;
  }


  public static get(userId: string, widgets: IWidget[]): UserModel | null {
    const widget = widgets.find(w =>
      w.metadata[config.appId] &&
      w.metadata[config.appId].owner === userId &&
      w.metadata[config.appId].formType === FormType.userSticker
    ) as any || null;

    return widget ? new UserModel(widget) : null;
  }

  /*
    public static getMeta(widget: IWidget): Meta | null {
      return widget ? widget.metadata[config.appId] : null;
    }
  */

  public static async create(userId: string, username: string, x: number, y: number): Promise<UserModel> {

    const [result] = await miro.board.widgets.create({
      type: 'sticker',
      text: username,
      style: {
        stickerBackgroundColor: colors.sticker
      },
      x,
      y,
      metadata: {
        [config.appId]: {
          owner: userId,
          formType: FormType.userSticker
        } as Meta
      },
      capabilities: {
        editable: false
      }
    });

    await miro.board.widgets.sendBackward(result.id);
    return new UserModel(result);
  }

  public static getAllCreatedUsers(widgets: IWidget[]): IStickerWidget[] {
    return widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === FormType.userSticker) as any;
  }

  protected async customCheck(userId: string, widgets: IWidget[]) {
    const userWidget = UserModel.get(userId, widgets);

    if (!userWidget) {
      await this.stopTrack();
      return false;
    }

    return true;
  }

  public async checkCanvas() {
    const widgets = await miro.board.widgets.get();
    const userId = await miro.currentUser.getId();
    const userWidget = UserModel.get(userId, widgets);

    if (!userWidget) {
      miro.removeListener('CANVAS_CLICKED', this.listener);
      this.listener = null;
      return;
    }

    const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);

    if (areBucketsOverFlow) {
      await BucketModel.resetBucketsPosition(0, 0, widgets);
    }

    for (const widget of widgets) {

      if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.bucket) {
        await this.checkBucketProportions(widget);
      }

      if (
        widget.metadata &&
        widget.metadata[config.appId] &&
        widget.metadata[config.appId].formType === formType.ball
      ) {
        if (widget.metadata[config.appId].owner === userId) {
          await BallModel.checkBallProportions(widget as any);
          await this.checkOwnBallPosition(userId, widget as any, widgets);
          continue;
        }

        if (widget.metadata[config.appId].owner !== userId && widget.lastModifiedUserId === userId) {
          await this.checkWrongMovedBallPosition(widget as any, widgets);
        }
      }

    }
  }

  protected async checkOwnBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]) {
    const ballMeta = BallModel.getMeta(ball);
    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets)

    // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); //todo uncomment once meta will work
    const drawBucket = BucketModel.get(BucketType.draw, widgets);

    if (userCardWithBall && allUserBallsCount > config.rules.memberBallLimit) {
      console.log('user reached limit in balls. Moving to draw bucket')
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, parseInt(drawBucket.text) + 1)
      return;
    }

    if (userCardWithBall && userId !== userCardWithBall.metadata[config.appId].owner) {

      if (ball.lastModifiedUserId !== userId) {
        console.log('wrong user touched ball');
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(BucketType.draw, widgets, parseInt(drawBucket.text) + 1);
        return;
      }

      if (ballMeta.participatedUserIds.indexOf(userCardWithBall.metadata[config.appId].owner) === -1) {
        ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
      }

      ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
      ballMeta.bucketType = null;
      BallModel.updateMeta(ball, ballMeta);
      return
    }

    const usersWidgets = UserModel.getAllCreatedUsers(widgets);
    // const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets); //todo uncomment once meta will work
    const targetBucket = BucketModel.get(BucketType.target, widgets);
    const isInTargetBucket = BucketModel.isBallInBucket(BucketType.target, ball, widgets);

    if (isInTargetBucket) {

      if (usersWidgets.length + 1 > ballMeta.participatedUserIds.length) {
        console.log('not all peers touched balls', usersWidgets.length, ballMeta.participatedUserIds);
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(BucketType.draw, widgets, parseInt(drawBucket.text) + 1)
        return;
      }

      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.target, widgets, parseInt(targetBucket.text) + 1)
      return;
    }

    if (!userCardWithBall && !isInTargetBucket) {
      console.log('outside of all valid cards');
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, parseInt(drawBucket.text) + 1)
      return;
    }
  }

  protected async checkWrongMovedBallPosition(ball: IShapeWidget, widgets: IWidget[]) {

    const POId = POModel.getOwnerId(widgets);

    if (ball.metadata[config.appId].owner === POId) {
      console.log('i`ve moved owner ball')
      BallModel.moveToBucket(bucketType.source, ball, widgets)
      return
    }

    // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); // todo uncomment once meta will work
    const drawBucket = BucketModel.get(BucketType.draw, widgets);

    // todo check

    BallModel.destroy(ball);
    BucketModel.updateBallsCount(BucketType.draw, widgets, parseInt(drawBucket.text) + 1)
  }

  public async stopTrack() {
    await miro.board.widgets.deleteById(this.widget.id);
    miro.removeListener('CANVAS_CLICKED', this.listener);
    this.listener = null;
  }
}
