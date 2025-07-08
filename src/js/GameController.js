import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Daemon from "./characters/Daemon"
import PositionedCharacter from "./PositionedCharacter";

// function objectToString(o) {
//     const entries = Object.entries(o).map(([key, value]) => {
//         if (typeof value === 'function') {
//             // Handle methods
//             return `${key}() { ${value.toString().slice(11, -1)} }`;
//         } else if (typeof value === 'object' && value !== null) {
//             // Handle nested objects
//             return `${key}: ${objectToString(value)}`;
//         } else {
//             // Handle primitive values
//             return `${key}: ${JSON.stringify(value)}`;
//         }
//     });
//     return `{ ${entries.join(', ')} }`;
// }

// function evalise(obj) {
//     // Helper function to convert the object to a string

//     // Convert the object to a string representation
//     const objString = objectToString(obj);
    
//     // Return the final eval-able string
//     return `a = ${objString}`;
// }


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    
    
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.getHint();
    this.gamePlay.addCellEnterListener(index => { this.onCellEnter(index); });
    // this.gamePlay.addCellLeaveListener(index => { this.onCellLeave(index); });
    this.gamePlay.addCellLeaveListener(() => { this.onCellLeave(); });
    // console.log(evalise(this.gamePlay));
    
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

  
  onCellEnter(index) {
    for(let posChar of [...this.positionedPlayerChars, ...this.positionedEnemyChars]) {
      if(index == posChar.position) {
        this.gamePlay.hintEl.textContent = `🎖${posChar.character.level} ⚔${posChar.character.attack} 🛡${posChar.character.defence} ❤${posChar.character.health}`;
        // this.gamePlay.hintEl.textContent = `\u{1F396}${posChar.character.level} \u{2694}${posChar.character.attack} \u{1F6E1}${posChar.character.defence} \u{2764}\u{FE0F}${posChar.character.health}`;
        this.gamePlay.moveHint(index);
        this.gamePlay.showHint();
        return;
      }
    }
    this.gamePlay.hideHint();
  }

  onCellLeave() {
    this.gamePlay.hideHint();
  }
  
  
  // onCellEnter(index) {
  //   let tooltipText = '';
  //   for(let posChar of [...this.positionedPlayerChars, ...this.positionedEnemyChars]) {
  //     if(index == posChar.position) {
  //       tooltipText = `🎖${posChar.character.level} ⚔${posChar.character.attack} 🛡${posChar.character.defence} ❤${posChar.character.health}`;
  //       break;
  //     }
  //   }
  //   this.gamePlay.showCellTooltip(tooltipText, index);
  // }

  // onCellLeave(index) {
  //   this.gamePlay.hideCellTooltip(index);
  // }

  onCellClick(index) {
    // TODO: react to click
  }
}
