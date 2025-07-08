import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Daemon from "./characters/Daemon"
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCellIndex = -1;
    
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.getHint();
    this.gamePlay.addCellEnterListener(index => { this.onCellEnter(index); });
    // this.gamePlay.addCellLeaveListener(index => { this.onCellLeave(index); });
    this.gamePlay.addCellLeaveListener(() => { this.onCellLeave(); });
    this.gamePlay.addCellClickListener((index) => { this.onCellClick(index); });
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
    const cellCharacter = this.positionedPlayerChars.filter(e => e.position == index)[0];
    if(cellCharacter) {
      if(this.selectedCellIndex >= 0) {
        this.gamePlay.deselectCell(this.selectedCellIndex);
      }
      this.gamePlay.selectCell(index);
      this.selectedCellIndex = index;
    }
    else {
      GamePlay.showError("Эту клетку нельзя выделить");
    }
  }
}
