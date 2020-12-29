import ICardWidget = SDK.ICardWidget;
import IShapeWidget = SDK.IShapeWidget;
import IWidget = SDK.IWidget;
import config from '../config/index';
import formType from '../static/formType';
import bucketType from '../static/bucketType';
import BucketType from '../static/bucketType';
import BallModel from './BallModel';
import BucketModel from './BucketModel';
import UserModel from './UserModel';
import colors from '../static/colors';
import POModel from './POModel';

interface OnlineUsersEvent {
  data: {
    id: string;
    name: string;
  }[]
}

export default class OwnerModel {

  public static getWidget(widgets: IWidget[]): ICardWidget | null {
    return widgets.find(w => w.metadata[config.appId] && w.metadata[config.appId].gameOwner) as any || null;
  }

  public static async create(x: number, y: number): Promise<void> {
    // @ts-ignore
    const onlineUsers = await miro.board.getOnlineUsers();
    const currentUserId = await miro.currentUser.getId();
    const currentUser = onlineUsers.find(o => o.id === currentUserId);
    await miro.board.widgets.create({
      type: 'card',
      title: `game owner: ${ currentUser.name }`,
      x,
      y,
      metadata: {
        [config.appId]: {
          gameOwner: currentUserId,
          formType: formType.card
        }
      }
    });
  }

  public static getOwnerId(widgets: IWidget[]): string | null {
    const widget = widgets.find(w => w.metadata[config.appId] && w.metadata[config.appId].gameOwner);

    if (!widget) {
      return null;
    }

    return widget.metadata[config.appId].gameOwner;
  }

  public static async isCurrentUserOwner(widgets: IWidget[]) {
    const currentUserId = await miro.currentUser.getId();
    const latestOwnerId = OwnerModel.getOwnerId(widgets);
    return latestOwnerId === currentUserId;
  }

  public static async trackChanges() {
    // @ts-ignore
    miro.addListener(miro.enums.event.ONLINE_USERS_CHANGED, OwnerModel.addWidgetToUsers)

    let isGameOwner = true;

    while (isGameOwner) {

      const widgets = await miro.board.widgets.get();
      const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);

      if (areBucketsOverFlow) {
        await BucketModel.resetBucketsPosition(0, 0, widgets);
      }

      for (const widget of widgets) {

        if(widget.metadata && widget.metadata[config.appId].formType === formType.bucket){
          await this.checkBucketProportions(widget);
        }

        if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.ball) {
          await this.checkBallProportions(widget as any);
          await this.checkBallPosition(widget as any, widgets);
        }
      }

      if (!(await OwnerModel.isCurrentUserOwner(widgets))) {
        isGameOwner = false;
      }

      await new Promise(res => setTimeout(res, 500));
    }
  }

  private static async checkBallProportions(ball: IShapeWidget) {
    if (ball.bounds.height !== config.balls.radius || ball.bounds.width !== config.balls.radius) {
      await BallModel.resetProportions(ball);
    }
  }

  private static async checkBucketProportions(bucket: any) {
    if (bucket.height !== config.bucket.widthHeight || bucket.width !== config.bucket.widthHeight) {
      await BucketModel.resetProportions(bucket);
    }
  }

  private static async checkBallPosition(ball: IShapeWidget, widgets: IWidget[]) {
    const gameOwnerId = OwnerModel.getOwnerId(widgets);
    const ballMeta = BallModel.getMeta(ball);

    const usersWidgets = UserModel.getAllCreatedUsers(widgets);// todo replace with enum
    const sourceBucket = BucketModel.get(BucketType.source, widgets);
    const sourceBucketMeta = BucketModel.getMeta(BucketType.source, widgets);
    const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets);
    const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets);

    const isInTargetBucket = BucketModel.isBallInBucket(BucketType.target, ball, widgets);

    if (!isInTargetBucket && ballMeta.bucketType === bucketType.target) {
      console.log('should return back to target bucket');
      ballMeta.owner = targetBucketMeta.owner;
      ballMeta.bucketType = BucketType.target;
      BallModel.moveToBucket(ball, ballMeta, widgets)
      BucketModel.updateBallsCount(BucketType.target, widgets)
      return;
    }

    if (isInTargetBucket) {
      if (usersWidgets.length > ballMeta.participatedUserIds.length) {
        console.log('not all peers touched balls');

        ballMeta.owner = drawBucketMeta.owner;
        ballMeta.bucketType = BucketType.draw;
        BallModel.moveToBucket(ball, ballMeta, widgets);
        BucketModel.updateBallsCount(BucketType.draw, widgets)
      } else if (ballMeta.owner !== targetBucketMeta.owner) {
        console.log('update ball owner and bucket type', targetBucketMeta.owner, targetBucketMeta.bucketType);
        ballMeta.owner = targetBucketMeta.owner;
        ballMeta.bucketType = targetBucketMeta.bucketType;
        BallModel.updateMeta(ball, ballMeta)
        BucketModel.updateBallsCount(BucketType.target, widgets)
      }

      return;
    }

    const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
    const isInSourceBucket = BucketModel.isBallInBucket(BucketType.source, ball, widgets);
    const isInDrawBucket = BucketModel.isBallInBucket(BucketType.draw, ball, widgets);

    if (!isInDrawBucket && ballMeta.bucketType === bucketType.draw) {
      ballMeta.owner = drawBucketMeta.owner;
      ballMeta.bucketType = BucketType.draw;
      BallModel.moveToBucket(ball, ballMeta, widgets);
      BucketModel.updateBallsCount(BucketType.draw, widgets)
    }
    if (!isInSourceBucket) {
      const ballsInSourceBucketAmount = BallModel.getBucketBallsAmount(bucketType.source, widgets);
      for (let i = 0; i <= (config.balls.initialAmount - ballsInSourceBucketAmount); i++) {
        await BallModel.create(sourceBucket.x, sourceBucket.y, sourceBucketMeta.owner, 1, colors.ball, BucketType.source);
      }
    }

    if (!userCardWithBall && !isInSourceBucket && !isInDrawBucket && !isInTargetBucket) {
      console.log('outside of all cards');
      ballMeta.owner = drawBucketMeta.owner;
      ballMeta.bucketType = BucketType.draw;
      BallModel.moveToBucket(ball, ballMeta, widgets);
      BucketModel.updateBallsCount(BucketType.draw, widgets);
      return;
    }

    const userBallsAmount = BallModel.getUserBallsAmount(userCardWithBall, widgets);

    if (userBallsAmount > config.rules.memberBallLimit) {
      console.log('user took too much balls', userBallsAmount, config.rules.memberBallLimit);
      console.log('removed', ball.id)

      ballMeta.owner = drawBucketMeta.owner;
      ballMeta.bucketType = BucketType.draw;
      BallModel.moveToBucket(ball, ballMeta, widgets);
      BucketModel.updateBallsCount(BucketType.draw, widgets);
      return;
    }

    if (userCardWithBall) {
      const userCardWithBallMeta = UserModel.getMeta(userCardWithBall);
      const stickerUserId = userCardWithBallMeta.owner;
      const ballOwnerUserId = ballMeta.owner;
      const ballMovedByUserId = ball.lastModifiedUserId;

      if (ballMovedByUserId !== ballOwnerUserId && ballMovedByUserId !== gameOwnerId) {
        console.log('wrong user moved ball to card (not owner)', ballMovedByUserId, ballOwnerUserId);

        ballMeta.owner = drawBucketMeta.owner;
        ballMeta.bucketType = BucketType.draw;
        BallModel.moveToBucket(ball, ballMeta, widgets);
        BucketModel.updateBallsCount(BucketType.draw, widgets);
        return;
      }

      if (ballMovedByUserId !== gameOwnerId) {
        //@ts-ignore
        if (ballMeta.participatedUserIds.includes(ballMovedByUserId)) {
          return;
        }

        ballMeta.participatedUserIds.push(ballMovedByUserId);
        ballMeta.owner = stickerUserId;
        ballMeta.bucketType = null;
        BallModel.updateMeta(ball, ballMeta);
        console.log('added', ball.metadata)
      }
    }
  }

  public static async addWidgetToUsers(ev: OnlineUsersEvent) {
    const widgets = await miro.board.widgets.get();
    const ownerId = OwnerModel.getOwnerId(widgets);
    let users = ev.data.filter(s => s.id !== ownerId);
    const POId = POModel.getOwnerId(widgets);

    if (!POId) {
      await POModel.create(users[0].id, users[0].name, 0, 0, widgets);
      users = users.slice(1);
    } else {
      users = users.filter(u => u.id !== POId);
    }

    const createdUsers = UserModel.getAllCreatedUsers(widgets)
      .map(w => UserModel.getMeta(w).owner);

    for (const user of users) {
      //@ts-ignore
      if (!createdUsers.includes(user.id))
        await UserModel.create(user.id, user.name, -config.bucket.widthHeight - 100, 0);
    }

    for (const createdUser of createdUsers) {
      const isUserOnline = !!users.find(u => u.id === createdUser);

      if (!isUserOnline) {
        await UserModel.remove(createdUser, widgets);
      }


    }

  }


}
