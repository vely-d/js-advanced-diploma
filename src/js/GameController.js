import themes from "./themes";
import { generateTeam } from "./generators"
import { indexToCoordinates, /*coordinatesToIndex,*/ getAngle } from "./mathHelpers"
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Daemon from "./characters/Daemon"
// import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService, gameState) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = gameState;
    this.selectedCharacterIndex = -1;

  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.getHint();
    this.gamePlay.addCellEnterListener(index => { this.onCellEnter(index); });
    this.gamePlay.addCellLeaveListener(index => { this.onCellLeave(index); });
    // this.gamePlay.addCellLeaveListener(() => { this.onCellLeave(); });
    this.gamePlay.addCellClickListener((index) => { this.onCellClick(index); });

    // TODO: load saved stated from stateService
  }

  layoutCharacters() {
    this.playersTeam = generateTeam([Bowman, Swordsman, Magician], 2, 3).characters;
    let playerPositions = [
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize),
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize + 1)
    ];
    let getRandomPlayerPosition = (() => {
      let positions = [...playerPositions];
      return function () {
        let randomIndex = Math.floor(Math.random() * positions.length);
        return positions.splice(randomIndex, 1)[0]
      }
    })();
    this.positionedPlayerChars = new Map();
    for (let pc of this.playersTeam) {
      this.positionedPlayerChars.set(getRandomPlayerPosition(), pc);
    }

    this.enemiesTeam = generateTeam([Vampire, Undead, Daemon], 2, 3).characters;
    let enemyPositions = playerPositions.map(position => position + this.gamePlay.boardSize - 2);
    // let enemyPositions = playerPositions.map(position => position + 2); // helps checking out enemy hovering
    let getRandomEnemyPosition = (() => {
      let positions = [...enemyPositions];
      return function () {
        let randomIndex = Math.floor(Math.random() * positions.length);
        return positions.splice(randomIndex, 1)[0]
      }
    })();
    this.positionedEnemyChars = new Map();
    for(let ec of this.enemiesTeam) {
      this.positionedEnemyChars.set(getRandomEnemyPosition(), ec);
    }

    this.gamePlay.redrawPositions(this.positionedPlayerChars);
    this.gamePlay.redrawPositions(this.positionedEnemyChars);
  }

  onCellEnter(index) {
    if (this.selectedCharacterIndex > -1 && this.selectedCharacterIndex != index) {
      if (this.positionedPlayerChars.get(index)) {
        this.gamePlay.setCursor("pointer");
        return;
      }
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      let selectedCoords = indexToCoordinates(this.selectedCharacterIndex, this.gamePlay.boardSize);
      let hoveredCoords = indexToCoordinates(index, this.gamePlay.boardSize);
      let hoveredVector = {
        x: hoveredCoords.x - selectedCoords.x,
        y: hoveredCoords.y - selectedCoords.y
      }

      let enemyHovered = this.positionedEnemyChars.get(index);

      // checking if player hovered the enemy and if so, is the enemy atackable
      if (enemyHovered && getAngle(hoveredVector) % 45 == 0 && Math.abs(hoveredVector.x) <= selectedCharacter.range && Math.abs(hoveredVector.y) <= selectedCharacter.range) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor("crosshair");
      }
      // checking if the empty cell user hovered is reachable 
      else if (!this.positionedPlayerChars.get(index) && !this.positionedEnemyChars.get(index) && getAngle(hoveredVector) % 45 == 0 && Math.abs(hoveredVector.x) <= selectedCharacter.stamina && Math.abs(hoveredVector.y) <= selectedCharacter.stamina) {
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor("pointer")
      } else {
        this.gamePlay.setCursor("not-allowed");
      }
    } else {
      let howeverCharacter = this.positionedPlayerChars.get(index) || this.positionedEnemyChars.get(index);
      if (howeverCharacter) {
        this.gamePlay.hintEl.textContent = `🎖${howeverCharacter.level} ⚔${howeverCharacter.attack} 🛡${howeverCharacter.defence} ❤${howeverCharacter.health}`;
        this.gamePlay.moveHint(index);
        this.gamePlay.showHint();
        return;
      }
      this.gamePlay.hideHint();
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideHint();
    if(index != this.selectedCharacterIndex) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor("default");
  }

  onCellClick(index) {
    const clickedPlayerCharacter = this.positionedPlayerChars.get(index);
    if (clickedPlayerCharacter) {
      if (this.selectedCharacterIndex == index) {
        this.gamePlay.deselectCell(index);
        this.selectedCharacterIndex = -1;
      } else if (this.selectedCharacterIndex >= 0) {
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.selectCell(index);
        this.selectedCharacterIndex = index;
      } else {
        this.gamePlay.selectCell(index);
        this.selectedCharacterIndex = index;
      }
      return;
    } else if(this.selectedCharacterIndex >= 0 && !this.positionedPlayerChars.get(index) && !this.positionedEnemyChars.get(index)) {
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      let selectedCoords = indexToCoordinates(this.selectedCharacterIndex, this.gamePlay.boardSize);
      let clickedCoords = indexToCoordinates(index, this.gamePlay.boardSize);
      let clickedVector = {
        x: clickedCoords.x - selectedCoords.x,
        y: clickedCoords.y - selectedCoords.y
      }
      if(getAngle(clickedVector) % 45 == 0 && Math.abs(clickedVector.x) <= selectedCharacter.stamina && Math.abs(clickedVector.y) <= selectedCharacter.stamina) {
        let movingCharater = this.positionedPlayerChars.get(this.selectedCharacterIndex);
        this.positionedPlayerChars.delete(this.selectedCharacterIndex);
        this.gamePlay.clearCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.selectedCharacterIndex = -1;
        this.positionedPlayerChars.set(index, movingCharater);
        this.gamePlay.drawPositionedCharacter(index, movingCharater);
      } else {
        GamePlay.showError("Сейчас выбранный персонаж не может туда добраться");
      }
    } else if(this.selectedCharacterIndex >= 0 && this.positionedEnemyChars.get(index)) {
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      let selectedCoords = indexToCoordinates(this.selectedCharacterIndex, this.gamePlay.boardSize);
      let clickedCoords = indexToCoordinates(index, this.gamePlay.boardSize);
      let clickedVector = {
        x: clickedCoords.x - selectedCoords.x,
        y: clickedCoords.y - selectedCoords.y
      }
      if(getAngle(clickedVector) % 45 == 0 && Math.abs(clickedVector.x) <= selectedCharacter.range && Math.abs(clickedVector.y) <= selectedCharacter.range) {
        let offensiveCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
        let targetEnemy = this.positionedEnemyChars.get(index);
        let damage = Math.max(offensiveCharacter.attack - targetEnemy.defence, offensiveCharacter.attack * 0.1)
        this.gamePlay.hideHint();
        this.gamePlay.showDamage(index, damage);
        targetEnemy.health = damage < targetEnemy.health ? targetEnemy.health - damage : 0;
        if(targetEnemy.health > 0) {
          this.gamePlay.drawPositionedCharacter(index, targetEnemy);
        } else {
          this.gamePlay.clearCell(index);
          this.positionedEnemyChars.delete(index);
        }
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.selectedCharacterIndex = -1;
      } else {
        GamePlay.showError("Выбранный персонаж сейчас не может атаковать этого врага");
      }
    }
    else {
      GamePlay.showError("Выберите персонажа");
    }
  }
}
