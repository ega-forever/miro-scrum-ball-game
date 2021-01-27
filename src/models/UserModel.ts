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

interface Meta {
  owner: string,
  formType: FormType.userSticker
}

export default class UserModel {

  public static isGameRunning = false;

  public static get(userId: string, widgets: IWidget[]): IStickerWidget | null {
    return widgets.find(w =>
      w.metadata[config.appId] &&
      w.metadata[config.appId].owner === userId &&
      w.metadata[config.appId].formType === FormType.userSticker
    ) as any || null;
  }

  public static getMeta(widget: IWidget): Meta | null {
    return widget ? widget.metadata[config.appId] : null;
  }

  public static async create(userId: string, username: string, x: number, y: number): Promise<void> {

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
  }

  public static getAllCreatedUsers(widgets: IWidget[]): IStickerWidget[] {
    return widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === FormType.userSticker) as any;
  }

  public static async trackChanges(userId: string) {

    UserModel.isGameRunning = true;

    while (UserModel.isGameRunning) { //todo check if user widget exists

      const widgets = await miro.board.widgets.get();
      const userWidget = UserModel.get(userId, widgets);

      if (!userWidget) {
        UserModel.isGameRunning = false;
        return;
      }

      for (const widget of widgets) {
        if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.ball && widget.metadata[config.appId].owner === userId) {
          await BallModel.checkBallProportions(widget as any);
          await this.checkBallPosition(userId, widget as any, widgets);
        }
      }

      await new Promise(res => setTimeout(res, 500));
    }
  }

  private static async checkBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]) {
    const ballMeta = BallModel.getMeta(ball);
    const currentUserCard = UserModel.get(userId, widgets);
    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets)

    const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets);

    if (userCardWithBall &&
      currentUserCard.metadata[config.appId].owner === userCardWithBall.metadata[config.appId].owner &&
      allUserBallsCount > config.rules.memberBallLimit) {
      console.log('user reached limit in balls. Moving to draw bucket')
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return;
    }

    if (userCardWithBall && userId !== userCardWithBall.metadata[config.appId].owner) {

      if (ball.lastModifiedUserId !== userId) {
        console.log('wrong user touched ball');
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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

    const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets);
    const isInTargetBucket = BucketModel.isBallInBucket(BucketType.target, ball, widgets);

    if (isInTargetBucket) {
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.target, widgets, targetBucketMeta.ballsCount + 1)
      return;
    }

    if (!userCardWithBall && !isInTargetBucket) {
      console.log('outside of all valid cards');
      BallModel.destroy(ball);
      BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
      return;
    }
  }

  public static async remove(userId: string, widgets: IWidget[]): Promise<void> {
    const widget = UserModel.get(userId, widgets);
    await miro.board.widgets.deleteById(widget.id);
  }

  public static async stopTrack(userId: string) {
    const widgets = await miro.board.widgets.get();
    const widget = UserModel.get(userId, widgets);
    await miro.board.widgets.deleteById(widget.id);
    UserModel.isGameRunning = false;
  }

}
