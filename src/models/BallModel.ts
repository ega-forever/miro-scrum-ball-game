import IShapeWidget = SDK.IShapeWidget;
import FormType from '../static/formType';
import formType from '../static/formType';
import config from '../config/index';
import BucketType from '../static/bucketType';
import UserModel from './UserModel';
import BucketModel from './BucketModel';
import IWidget = SDK.IWidget;

interface Meta {
  owner: string,
  participatedUserIds: string[],
  bucketType: BucketType,
  formType: FormType
}

export default class BallModel {

  public static async get(ballId: string): Promise<IShapeWidget | null> {
    const widgets = await miro.board.widgets.get();
    return widgets.find(w => w.id === ballId) as any || null;
  }

  public static getMeta(widget: IShapeWidget): Meta | null {
    return widget ? widget.metadata[config.appId] : null;
  }

  public static async create(x: number, y: number, owner: string, index: number, color: string, bucketType: BucketType, ownerId: string): Promise<void> {
    await miro.board.widgets.create({
      type: 'shape',
      style: {
        backgroundColor: color,
        shapeType: 4
      },
      height: 50,
      width: 50,
      x,
      y,
      metadata: {
        [config.appId]: {
          owner,
          participatedUserIds: [ownerId],
          bucketType,
          formType: FormType.ball
        } as Meta
      }
    })
  }

  public static userCardWithBall(ball: IShapeWidget, widgets: IWidget[]): IShapeWidget {
    const usersCards = UserModel.getAllCreatedUsers(widgets);
    return usersCards.find(s => {
      return (ball.x - ball.width / 2) >= (s.bounds.x - s.bounds.width / 2) && (ball.x + ball.width / 2) <= (s.bounds.x + s.bounds.width / 2) &&
        (ball.y - ball.height / 2) >= (s.bounds.y - s.bounds.height / 2) && (ball.y + ball.height / 2) <= (s.bounds.y + s.bounds.height / 2)
    }) as any;
  }

  public static getUserBallsAmount(userStickerWidget, widgets: IWidget[]): number {

    if (!userStickerWidget) {
      return 1;
    }

    const userBallsAmount =
      widgets.filter((w: any) =>
        w.metadata[config.appId] &&
        w.metadata[config.appId].formType === formType.ball &&
        (w.x - w.width / 2) >= (userStickerWidget.bounds.x - userStickerWidget.bounds.width / 2) && (w.x + w.width / 2) <= (userStickerWidget.bounds.x + userStickerWidget.bounds.width / 2) &&
        (w.y - w.height / 2) >= (userStickerWidget.bounds.y - userStickerWidget.bounds.height / 2) && (w.y + w.height / 2) <= (userStickerWidget.bounds.y + userStickerWidget.bounds.height / 2)
      ).length;

    return userBallsAmount ? userBallsAmount : 1;
  }

  public static getBucketBallsAmount(bucketType: BucketType, widgets: IWidget[]): number {
    const bucketMeta = BucketModel.getMeta(bucketType, widgets);
    return bucketMeta.ballsCount;
  }


    public static getBucketBalls(bucketType: BucketType, widgets: IWidget[]): IShapeWidget[] {
      return widgets.filter(w =>
        w.metadata[config.appId] &&
        w.metadata[config.appId].formType === formType.ball &&
        w.metadata[config.appId].bucketType === bucketType
      ) as any;
    }

  public static async updateMeta(ball: IShapeWidget, ballMeta: Meta): Promise<void> {

    Object.assign(ball, {
      metadata: {
        [config.appId]: ballMeta
      }
    });

    await miro.board.widgets.update({
      id: ball.id,
      metadata: {
        [config.appId]: ballMeta
      },
      text: (ballMeta.participatedUserIds.length - 1).toString()
    });
  }

  public static async moveToBucket(bucketType: BucketType, ball: IShapeWidget, widgets: IWidget[]): Promise<void> {
    const bucket = BucketModel.get(bucketType, widgets);

    const update = {
      id: ball.id,
      x: bucket.x,
      y: bucket.y,
      text: '',
      metadata: ball.metadata
    };

    Object.assign(ball, update);
    await miro.board.widgets.update(update);
  }

  public static async destroy(ball: IShapeWidget): Promise<void> {
    await miro.board.widgets.deleteById([ball.id]);
  }


  public static async resetProportions(ball: IShapeWidget): Promise<void> {

    Object.assign(ball, {
      bounds: {
        ...ball.bounds,
        height: config.balls.radius,
        width: config.balls.radius
      },
      height: config.balls.radius,
      width: config.balls.radius
    });

    await miro.board.widgets.update(ball);
  }

  public static async checkBallProportions(ball: IShapeWidget) {
    if (ball.bounds.height !== config.balls.radius || ball.bounds.width !== config.balls.radius) {
      await BallModel.resetProportions(ball);
    }
  }

}
