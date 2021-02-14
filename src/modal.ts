import POModel from './models/POModel';
import UserModel from './models/UserModel';
import config from './config/index';
import ActionType from './static/actionType';
import { getLocale } from './locales/index';

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

//@ts-ignore
window.onResetGameClick = async () => {
  await miro.board.ui.closeModal({ option: ActionType.resetGamePO });
}

//@ts-ignore
window.setLocale = (locale)=>{
  document.getElementById('start-game-po').textContent = getLocale(locale).modal.startGamePO;
  document.getElementById('reset-game-po').textContent = getLocale(locale).modal.resetGamePO;
  document.getElementById('end-game-po').textContent = getLocale(locale).modal.endGamePO;
  document.getElementById('join-game-user').textContent = getLocale(locale).modal.joinGameUser;
  document.getElementById('leave-game-user').textContent = getLocale(locale).modal.leaveGameUser;
  document.getElementById('description').textContent = getLocale(locale).modal.description;

  const enLocaleButton = document.getElementById('locale-btn-en');
  const ruLocaleButton = document.getElementById('locale-btn-ru');

  if(locale.toLowerCase().includes('en')){
    ruLocaleButton.classList.add('btn-secondary');
    ruLocaleButton.classList.remove('btn-primary');

    enLocaleButton.classList.remove('btn-secondary');
    enLocaleButton.classList.add('btn-primary');
  }

  if(locale.toLowerCase().includes('ru')){
    enLocaleButton.classList.add('btn-secondary');
    enLocaleButton.classList.remove('btn-primary');

    ruLocaleButton.classList.remove('btn-secondary');
    ruLocaleButton.classList.add('btn-primary');
  }
}

const init = async () => {

  const currentUserId = await miro.currentUser.getId();
  const widgets = await miro.board.widgets.get();
  let PO = POModel.get(widgets);


  if (PO && PO.widget.metadata[config.appId].owner === currentUserId) {
    document.getElementById('end-game-po').style.display = 'inline-block';
    document.getElementById('reset-game-po').style.display = 'inline-block';
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

  const isCurrentLanguageSupported = !!(window.navigator.language.toLowerCase().includes('ru') || window.navigator.language.toLowerCase().includes('en'));

  // @ts-ignore
  window.setLocale(isCurrentLanguageSupported ? window.navigator.language : 'en');
}

miro.onReady(init);
