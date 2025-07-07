import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Daemon from "./characters/Daemon"
import PositionedCharacter from "./PositionedCharacter";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    
    
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  layoutCharacters() {
    this.playersTeam = generateTeam([Bowman, Swordsman, Magician], 2, 3);
    let playerPositions = [ 
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize),
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize + 1) 
    ];
    let getRandomPlayerPosition = (() => {
      let positions = [...playerPositions];
      return function() { 
        let randomIndex = Math.floor(Math.random() * positions.length);
        return positions.splice(randomIndex, 1)[0]
      }
    })();
    this.positionedPlayerChars = this.playersTeam.characters.map(character => new PositionedCharacter(character, getRandomPlayerPosition()));
    
    let enemyPositions = playerPositions.map(position => position + this.gamePlay.boardSize - 2) 
    let getRandomEnemyPosition = (() => {
      let positions = [...enemyPositions];
      return function() { 
        let randomIndex = Math.floor(Math.random() * positions.length);
        return positions.splice(randomIndex, 1)[0]
      }
    })();
    this.enemiesTeam = generateTeam([Vampire, Undead, Daemon], 2, 3);
    this.positionedEnemyChars = this.enemiesTeam.characters.map(character => new PositionedCharacter(character, getRandomEnemyPosition()));

    this.gamePlay.redrawPositions(this.positionedPlayerChars);
    this.gamePlay.redrawPositions(this.positionedEnemyChars);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
