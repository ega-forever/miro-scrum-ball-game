import ActionType from './static/actionType';
import POModel from './models/POModel';
import UserModel from './models/UserModel';
import config from './config/index';
// @ts-ignore
import icon from '../assets/icon_28_28.svg';

const init = async () => {

  let currentUserId;
  let widgets;
  let PO;
  let user;

  try {
    currentUserId = await miro.currentUser.getId();
    widgets = await miro.board.widgets.get();
    PO = POModel.get(widgets);
    user = UserModel.get(currentUserId, widgets);
  } catch (e) {

  }

  if (PO && PO.widget.metadata[config.appId].owner === currentUserId && !PO.hasCanvasListener()) {
    PO.addCanvasListener();
  }

  if (user && !user.hasCanvasListener()) {
    user.addCanvasListener();
  }

  const onClick = async () => {
    const isAuthorized = await miro.isAuthorized();

    if (!isAuthorized) {
      //@ts-ignore
      await miro.requestAuthorization();
    }

    const result: { option: ActionType, locale: string } = await miro.board.ui.openModal('modal.html', {
      width: 450,
      height: 150
    });
    if (result) {
      await processSelectedAction(result.option, result.locale);
    }
    return
  }

  await miro.initialize({
    extensionPoints: {
      toolbar: async () => {
        return {
          title: 'Scrum balls',
          librarySvgIcon: icon,
          toolbarSvgIcon: icon,
          onClick: onClick
        }
      }
    }
  });

  const processSelectedAction = async (option: ActionType, locale: string) => {

    // @ts-ignore
    const onlineUsers = await miro.board.getOnlineUsers();
    currentUserId = await miro.currentUser.getId();
    const currentUsername = onlineUsers.find(u => u.id === currentUserId).name;
    widgets = await miro.board.widgets.get();

    if (option === ActionType.startNewGamePO) {
      PO = await POModel.create(currentUserId, currentUsername, 0 - config.bucket.widthHeight - 100, 0, widgets, locale);
      PO.addCanvasListener()
    }

    if (option === ActionType.leaveGameUser) {
      await user.stopTrack();
    }

    if (option === ActionType.joinGameUser) {
      user = await UserModel.create(currentUserId, currentUsername, -config.bucket.widthHeight * 2 - 100, 0);
      user.addCanvasListener();
    }

    if (option === ActionType.endGamePO) {
      await PO.stopTrack();
    }

    if (option === ActionType.resetGamePO) {
      await PO.resetScores();
    }

  }
}

miro.onReady(init);
