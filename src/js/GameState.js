export default class GameState {
  static from(GameControllerObject) {
    let state = {
      selectedCharacterIndex: -1,
      gameOver: GameControllerObject.gameOver,
      level: GameControllerObject.level,
      boardSize: GameControllerObject.boardSize,
      positionedPlayerChars: Array.from(GameControllerObject.positionedPlayerChars),
      positionedEnemyChars: Array.from(GameControllerObject.positionedEnemyChars),
      score: GameControllerObject.score,
      highscore: GameControllerObject.highscore
    }

    return state;
  }
}
