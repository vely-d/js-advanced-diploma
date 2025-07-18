/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';
import GameState from './GameState'

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const initialGameState = GameState.from({ playersCount: 2, activePlayerIndex: 0 });

const gameCtrl = new GameController(gamePlay, stateService, initialGameState);
gameCtrl.init();

// don't write your code here
