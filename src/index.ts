import ActionType from './static/actionType';
import POModel from './models/POModel';
import UserModel from './models/UserModel';
import config from './config/index';

const init = async () => {

  const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>BUSINESS</title><g id="scrum_ball_game" data-name="02.TARGET"><path d="M25.06,9.76a11,11,0,1,1-2.82-2.82l1.43-1.43a13,13,0,1,0,2.82,2.82Z"/><path d="M20.06,9.12A7.9,7.9,0,0,0,16,8a8,8,0,1,0,8,8,7.9,7.9,0,0,0-1.12-4.06l-1.47,1.47A5.9,5.9,0,0,1,22,16a6,6,0,1,1-6-6,5.9,5.9,0,0,1,2.59.59Z"/><circle cx="16" cy="16" r="2"/><path d="M28.78,3.22V.78L26.59,3l-.44,1.77a1,1,0,0,0-.58.27l-7.77,7.77a1,1,0,1,0,1.41,1.41L27,6.43a1,1,0,0,0,.27-.58L29,5.41l2.2-2.2Z"/></g></svg>`;

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
      await miro.authorize({
        response_type: 'token',
        redirect_uri: 'https://ega-forever.github.io/miro-scrum-ball-game/auth-success.html'
      });
      return;
    }

    const result: { option: ActionType } = await miro.board.ui.openModal('modal.html');
    if (result) {
      await processSelectedAction(result.option);
    }
    return
  }

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

  async function processSelectedAction(option: ActionType) {

    // @ts-ignore
    const onlineUsers = await miro.board.getOnlineUsers();
    currentUserId = await miro.currentUser.getId();
    const currentUsername = onlineUsers.find(u => u.id === currentUserId).name;
    widgets = await miro.board.widgets.get();

    if (option === ActionType.startNewGamePO) {
      PO = await POModel.create(currentUserId, currentUsername, 0 - config.bucket.widthHeight - 100, 0, widgets);
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

  }
}

init();
