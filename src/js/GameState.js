export default class GameState {
  static from(object) {
    // TODO: create object
    
    // let state = {
    //   playersCount: object.playersCount,
    //   activePlayerIndex: object.activePlayerIndex,
    //   next() {
    //     return this.activePlayerIndex = (this.activePlayerIndex + 1) % this.playersCount;
    //   }
    // }

    // let state = { ...object }
    
    let state = {
      theme: object.theme,
      boardSize: object.boardSize,
      positionedPlayerChars: object.positionedPlayerChars,
      positionedEnemyChars: object.positionedEnemyChars,
      points: object.points
    }

    return state;
  }
}
