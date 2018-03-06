import createSceneAuthenticate from './scene-authenticate';
import createSceneLogin from './scene-login';
import createSceneRegister from './scene-register';
import createSceneLobby from './scene-lobby';
import createSceneGame from './scene-game';

export default {
  authenticate: (game) => createSceneAuthenticate(game),
  login: (game) => createSceneLogin(game),
  register: (game) => createSceneRegister(game),
  lobby: (game) => createSceneLobby(game),
  game: (game) => createSceneGame(game),
};
