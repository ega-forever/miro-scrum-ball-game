import BucketType from './static/bucketType';
import config from './config/index';
import OwnerModel from './models/OwnerModel';
import BucketModel from './models/BucketModel';
import BallModel from './models/BallModel';
import IWidget = SDK.IWidget;
import POModel from './models/POModel';
import UserModel from './models/UserModel';

const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>BUSINESS</title><g id="_02.TARGET" data-name="02.TARGET"><path d="M25.06,9.76a11,11,0,1,1-2.82-2.82l1.43-1.43a13,13,0,1,0,2.82,2.82Z"/><path d="M20.06,9.12A7.9,7.9,0,0,0,16,8a8,8,0,1,0,8,8,7.9,7.9,0,0,0-1.12-4.06l-1.47,1.47A5.9,5.9,0,0,1,22,16a6,6,0,1,1-6-6,5.9,5.9,0,0,1,2.59.59Z"/><circle cx="16" cy="16" r="2"/><path d="M28.78,3.22V.78L26.59,3l-.44,1.77a1,1,0,0,0-.58.27l-7.77,7.77a1,1,0,1,0,1.41,1.41L27,6.43a1,1,0,0,0,.27-.58L29,5.41l2.2-2.2Z"/></g></svg>`;

miro.onReady(async () => {
  await miro.initialize({
    extensionPoints: {
      bottomBar: async () => {
        return {
          title: 'Scrum balls (start / stop)',
          svgIcon: startIcon,
          onClick: onClick
        }
      }
    }
  });
});


async function onClick() {
  const isAuthorized = await miro.isAuthorized();

  if(!isAuthorized){
    await miro.authorize({
      response_type: 'token',
      redirect_uri: `https://${window.location.host}/auth-success.html`
    });
    return;
  }

  // @ts-ignore
  const onlineUsers = await miro.board.getOnlineUsers();
  const currentUserId = await miro.currentUser.getId();
  const currentUsername = onlineUsers.find(u => u.id === currentUserId).name;
  const widgets = await miro.board.widgets.get();
  const POId = POModel.getOwnerId(widgets);

  if (!POId) {
    await POModel.create(currentUserId, currentUsername, 0 - config.bucket.widthHeight - 100, 0, widgets);
    POModel.trackChanges(currentUserId);
    return
  }

  if (POId === currentUserId) {
    // todo track his changes
    POModel.trackChanges(currentUserId);
    return
  }

  const userWidget = UserModel.get(currentUserId, widgets);

  if (!userWidget) {
    await UserModel.create(currentUserId, currentUsername, -config.bucket.widthHeight - 100, 0);
  }

  UserModel.trackChanges(currentUserId);
}

/*
async function start(widgets: IWidget[]) {
  let ownerWidget = OwnerModel.getWidget(widgets);

  if (ownerWidget) {
    await resetGame(widgets);
  }

  // @ts-ignore
  const onlineUsers = await miro.board.getOnlineUsers();
  if (onlineUsers.length < 3) {
    miro.showErrorNotification('there should be at least 3 online players to play')
    return;
  }

  await OwnerModel.create(0 - config.bucket.widthHeight - 100, 0);

  await OwnerModel.addWidgetToUsers({ data: onlineUsers });
  OwnerModel.trackChanges();
}
*/

/*
const resetGame = async (widgets: IWidget[]) => {
  //@ts-ignore
  miro.removeListener(miro.enums.event.ONLINE_USERS_CHANGED, OwnerModel.addWidgetToUsers);

  const ballInTargetBucketWidgets = BallModel.getBucketBalls(BucketType.target, widgets);
  const ballInDrawBucketWidgets = BallModel.getBucketBalls(BucketType.draw, widgets);

  for (const widget of [...ballInDrawBucketWidgets, ...ballInTargetBucketWidgets]) {
    await miro.board.widgets.deleteById(widget.id);
    widgets = widgets.filter(w => w.id !== widget.id);
  }

  await BucketModel.updateBallsCount(BucketType.target, widgets);
  await BucketModel.updateBallsCount(BucketType.draw, widgets);
};
*/
