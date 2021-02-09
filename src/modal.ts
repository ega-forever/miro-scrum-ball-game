import POModel from './models/POModel';
import UserModel from './models/UserModel';
import config from './config/index';
import ActionType from './static/actionType';

//@ts-ignore
window.onStartGameClick = async () => {
  await miro.board.ui.closeModal({ option: ActionType.startNewGamePO });
}

//@ts-ignore
window.onUserLeaveGameClick = async () => {
  await miro.board.ui.closeModal({ option: ActionType.leaveGameUser });
}

//@ts-ignore
window.onUserJoinGameClick = async () => {
  await miro.board.ui.closeModal({ option: ActionType.joinGameUser });
}

//@ts-ignore
window.onEndGameClick = async () => {
  await miro.board.ui.closeModal({ option: ActionType.endGamePO });
}

const init = async () => {

  const currentUserId = await miro.currentUser.getId();
  const widgets = await miro.board.widgets.get();
  let PO = POModel.get(widgets);


  if (PO && PO.widget.metadata[config.appId].owner === currentUserId) {
    document.getElementById('end-game-po').style.display = 'inline-block';
  }

  if (!PO) {
    document.getElementById('start-game-po').style.display = 'inline-block';
  }

  let user = UserModel.get(currentUserId, widgets);

  if (user) {
    document.getElementById('leave-game-user').style.display = 'inline-block';
  }

  if (PO && PO.widget.metadata[config.appId].owner !== currentUserId && !user) {
    document.getElementById('join-game-user').style.display = 'inline-block';
  }

}

init();
