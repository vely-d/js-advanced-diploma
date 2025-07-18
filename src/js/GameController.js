import themes from "./themes";
import { generateTeam } from "./generators"
import { indexToCoordinates, /*coordinatesToIndex,*/ getAngle, indexDistance, canAttack, Damage, calcBotsTraveling } from "./mathHelpers"
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
    this.controlsActive = true;
    this.gameOver = false;
    // this.players = [new Player('player1'), new Player('player2')]
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
    this.enemiesTeam = generateTeam([Vampire, Undead, Daemon], 2, 3).characters;
    this.positionedPlayerChars = new Map();
    this.positionedEnemyChars = new Map();
    let positions = [
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize),
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize + 1)
    ]
    let getRandomPosition = () => positions.splice(Math.floor(Math.random() * positions.length), 1)[0]
    
    for (let pc of this.playersTeam) {
      this.positionedPlayerChars.set(getRandomPosition(), pc);
    }
    positions = positions.map(p => p + this.gamePlay.boardSize - 2)
    for (let ec of this.enemiesTeam) {
      this.positionedEnemyChars.set(getRandomPosition(), ec);
    }

    this.gamePlay.redrawPositions(this.positionedPlayerChars);
    this.gamePlay.redrawPositions(this.positionedEnemyChars);
  }

  onCellEnter(index) {
    if (!this.controlsActive) {
      this.gamePlay.setCursor('progress');
      return;
    }
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
    // if(!this.controlsActive) {
    //   this.gamePlay.setCursor('progress');
    //   return;
    // }
    this.gamePlay.hideHint();
    if (index != this.selectedCharacterIndex) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor("default");
  }

  onCellClick(index) {
    if (!this.controlsActive) {
      return
    }
    const clickedPlayerCharacter = this.positionedPlayerChars.get(index);
    // selecting branch
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
    }
    // moving branch
    else if (this.selectedCharacterIndex >= 0 && !this.positionedPlayerChars.get(index) && !this.positionedEnemyChars.get(index)) {
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      let selectedCoords = indexToCoordinates(this.selectedCharacterIndex, this.gamePlay.boardSize);
      let clickedCoords = indexToCoordinates(index, this.gamePlay.boardSize);
      let clickedVector = {
        x: clickedCoords.x - selectedCoords.x,
        y: clickedCoords.y - selectedCoords.y
      }
      if (getAngle(clickedVector) % 45 == 0 && Math.abs(clickedVector.x) <= selectedCharacter.stamina && Math.abs(clickedVector.y) <= selectedCharacter.stamina) {
        let movingCharater = this.positionedPlayerChars.get(this.selectedCharacterIndex);
        this.positionedPlayerChars.delete(this.selectedCharacterIndex);
        this.gamePlay.clearCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.selectedCharacterIndex = -1;
        this.positionedPlayerChars.set(index, movingCharater);
        this.gamePlay.drawPositionedCharacter(index, movingCharater);

        this.botMakesTurn();
      } else {
        GamePlay.showError("Сейчас выбранный персонаж не может туда добраться");
      }
    }
    // attacking branch
    else if (this.selectedCharacterIndex >= 0 && this.positionedEnemyChars.get(index)) {
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      // let selectedCoords = indexToCoordinates(this.selectedCharacterIndex, this.gamePlay.boardSize);
      // let clickedCoords = indexToCoordinates(index, this.gamePlay.boardSize);
      // let clickedVector = {
      //   x: clickedCoords.x - selectedCoords.x,
      //   y: clickedCoords.y - selectedCoords.y
      // }
      let attackIsPossible = canAttack(selectedCharacter, this.selectedCharacterIndex, index, this.gamePlay.boardSize);
      // if(getAngle(clickedVector) % 45 == 0 && Math.abs(clickedVector.x) <= selectedCharacter.range && Math.abs(clickedVector.y) <= selectedCharacter.range) {
      if (attackIsPossible) {
        // let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
        let targetEnemy = this.positionedEnemyChars.get(index);
        let damage = Damage(selectedCharacter, targetEnemy);
        this.gamePlay.hideHint();
        this.gamePlay.showDamage(index, damage);
        targetEnemy.health = damage < targetEnemy.health ? targetEnemy.health - damage : 0;
        if (targetEnemy.health > 0) {
          this.gamePlay.drawPositionedCharacter(index, targetEnemy);
        } else {
          this.gamePlay.clearCell(index);
          this.positionedEnemyChars.delete(index);
        }
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.controlsActive = false;
        // this.gamePlay.showDamage(index, damage, () => { this.controlsActive = true; this.gamePlay.setCursor("default"); })
        this.gamePlay.showDamage(index, damage, () => { this.botMakesTurn(); })
        this.selectedCharacterIndex = -1;


      } else {
        GamePlay.showError("Выбранный персонаж сейчас не может атаковать этого врага");
      }
    }
    // error
    else {
      GamePlay.showError("Выберите персонажа");
    }
  }

  botMakesTurn() {
    // 1) find the most vulnerable player characters

    let targetChars = []
    let targetCharIndexes = []
    let minHealth = Infinity

    for (let [index, playerChar] of this.positionedPlayerChars) {
      if (playerChar.health === minHealth) {
        targetChars.push(playerChar)
        targetCharIndexes.push(index)
      }
      if (playerChar.health < minHealth) {
        targetChars = [playerChar]
        targetCharIndexes = [index]
        minHealth = playerChar.health
      }
    }

    // 2) pick the attacker-target pair of characters

    let attacker = null
    let attackerIndex = -1
    let target = null
    let targetIndex = -1
    let minDistance = Infinity

    for (let [botCharIndex, botChar] of this.positionedEnemyChars) {
      for (let i in targetCharIndexes) {
        let playerCharIndex = targetCharIndexes[i]
        let currentDistance = indexDistance(botCharIndex, playerCharIndex, this.gamePlay.boardSize)
        // if (indexDistance(botCharIndex, playerCharIndex) < minDistance) {
        if (currentDistance < minDistance) {
          // minDistance = indexDistance(botCharIndex, playerCharIndex, this.gamePlay.boardSize)
          minDistance = currentDistance
          attacker = botChar
          attackerIndex = botCharIndex
          target = targetChars[i]
          targetIndex = targetCharIndexes[i]
        }
      }
    }

    // 3) deside what to do (attack or move) and make this decision

    let attackIsPossible = canAttack(attacker, attackerIndex, targetIndex, this.gamePlay.boardSize)
    if (attackIsPossible) {
      let damage = Damage(attacker, target);
      target.health = target.health > damage ? target.health - damage : 0;
      if (target.health > 0) {
        this.gamePlay.drawPositionedCharacter(targetIndex, target);
      } else {
        this.gamePlay.clearCell(targetIndex);
        this.positionedPlayerChars.delete(targetIndex);
      }
      this.gamePlay.showDamage(targetIndex, damage, () => { this.controlsActive = true; this.gamePlay.setCursor("default"); })
    } else {
      this.positionedEnemyChars.delete(attackerIndex);
      this.gamePlay.clearCell(attackerIndex);

      let occupiedCellIndexes = [...Array.from(this.positionedPlayerChars.keys()), ...Array.from(this.positionedEnemyChars.keys())]
      let newAttackerIndex = calcBotsTraveling(attacker, attackerIndex, targetIndex, occupiedCellIndexes, this.gamePlay.boardSize);
      this.positionedEnemyChars.set(newAttackerIndex, attacker);
      this.gamePlay.drawPositionedCharacter(newAttackerIndex, attacker);

      this.controlsActive = true;
      this.gamePlay.setCursor("default");
    }
  }

  // maybe next time
  // async mainLoop() {
  //   // so that initially it equals 0
  //   let playerIndex = -1;
  //   while(!this.gameOver) {
  //     playerIndex = (playerIndex + 1) % this.players.length;
  //     await this.players[playerIndex].makeTurn();
  //   }
  // }
}
