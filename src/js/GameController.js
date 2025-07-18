import themes from "./themes";
import { generateTeam } from "./generators"
import { indexToCoordinates, getAngle, indexDistance, canAttack, Damage, calcBotsTraveling } from "./mathHelpers"
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Vampire from "./characters/Vampire"
import Undead from "./characters/Undead"
import Daemon from "./characters/Daemon"
import GamePlay from "./GamePlay"
import GameState from "./GameState";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameOver = false;

    this.controlsActive = true;
    this.selectedCharacterIndex = -1;
    this.positionedPlayerChars = new Map();
    this.positionedEnemyChars = new Map();
    this.level = 1;
    this.score = 0;
    this.highscore = 0;
  }

  init() {
    this.gamePlay.setupUi();
    this.gamePlay.addNewGameListener(() => { this.newGame(); });
    this.gamePlay.addSaveGameListener(() => { this.saveState(); });
    this.gamePlay.addLoadGameListener(() => { this.loadState(); });
    this.loadState();
  }

  newGame() {
    let playersTeam = generateTeam([Bowman, Swordsman, Magician], 1, 3).characters;
    let enemiesTeam = generateTeam([Vampire, Undead, Daemon], 1, 3).characters;
    this.layoutCharacters(playersTeam, enemiesTeam);

    this.level = 1;

    this.startSession();
  }

  startSession() {
    let theme = Object.values(themes)[this.level - 1];
    this.gamePlay.setupBoard(theme);
    this.gamePlay.clearAllCells();

    this.gamePlay.clearMouseControls();
    this.gamePlay.addCellEnterListener(index => { this.onCellEnter(index); });
    this.gamePlay.addCellLeaveListener(index => { this.onCellLeave(index); });
    this.gamePlay.addCellClickListener(index => { this.onCellClick(index); });

    this.gamePlay.redrawPositions(this.positionedPlayerChars);
    this.gamePlay.redrawPositions(this.positionedEnemyChars);
  }

  layoutCharacters(playersTeam, enemiesTeam) {
    this.positionedPlayerChars = new Map();
    this.positionedEnemyChars = new Map();

    let playerPositions = [
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize),
      ...Array.from({ length: this.gamePlay.boardSize }, (_, i) => i * this.gamePlay.boardSize + 1)
    ];
    let enemyPositions = playerPositions.map(p => p + this.gamePlay.boardSize - 2);
    let getRandomPlayerPosition = () => playerPositions.splice(Math.floor(Math.random() * playerPositions.length), 1)[0];
    let getRandomEnemyPosition = () => enemyPositions.splice(Math.floor(Math.random() * enemyPositions.length), 1)[0];
    for (let pc of playersTeam) {
      this.positionedPlayerChars.set(getRandomPlayerPosition(), pc);
    }
    for (let ec of enemiesTeam) {
      this.positionedEnemyChars.set(getRandomEnemyPosition(), ec);
    }
  }

  saveState() {
    if(this.gameOver) {
      alert('can not save - the game session is already finished');
      return;
    }
    this.stateService.save(GameState.from(this));
  }

  loadState() {
    let state = this.stateService.load();
    if(state === null) {
      let callstack = (new Error()).stack.split('\n    at ')
      if(!callstack[2].includes('init')) {
        alert('no savestate found. try saving the game first');
      } else {
        console.log('no savestate found. empty field was loaded')
      }
      return;
    }

    for (let prop in state) {
      this[prop] = state[prop];
    }

    this.positionedPlayerChars = GameController.formatStatePositionedChars(this.positionedPlayerChars);
    this.positionedEnemyChars = GameController.formatStatePositionedChars(this.positionedEnemyChars);

    this.startSession();
  }

  static formatStatePositionedChars(positionedChars) {
    let charClasses = {
      bowman: Bowman,
      swordsman: Swordsman,
      magician: Magician,
      undead: Undead,
      vampire: Vampire,
      daemon: Daemon
    };

    let formattedPositionedChars = positionedChars.map(function (pair) {
      let position = pair[0];
      let charData = pair[1];
      let charClass = charClasses[charData.type];
      let creationArgs = [charData.level, charData.stamina, charData.range, charData.attack, charData.defence, charData.health, false];
      let character = new charClass(...creationArgs);
      return [position, character];
    });

    return new Map(formattedPositionedChars)
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
        this.gamePlay.deselectCell(index);
        this.selectedCharacterIndex = -1;
        this.positionedPlayerChars.set(index, movingCharater);
        this.gamePlay.drawPositionedCharacter(index, movingCharater);

        this.finishTurn('player');
      } else {
        GamePlay.showError("Сейчас выбранный персонаж не может туда добраться");
      }
    }
    // attacking branch
    else if (this.selectedCharacterIndex >= 0 && this.positionedEnemyChars.get(index)) {
      let selectedCharacter = this.positionedPlayerChars.get(this.selectedCharacterIndex);
      let attackIsPossible = canAttack(selectedCharacter, this.selectedCharacterIndex, index, this.gamePlay.boardSize);
      if (attackIsPossible) {
        let targetEnemy = this.positionedEnemyChars.get(index);
        let damage = Damage(selectedCharacter, targetEnemy);
        this.gamePlay.hideHint();
        this.gamePlay.showDamage(index, damage);
        targetEnemy.health = damage < targetEnemy.health ? targetEnemy.health - damage : 0;
        if (targetEnemy.health > 0) {
          this.gamePlay.drawPositionedCharacter(index, targetEnemy);
        } else {
          this.score += targetEnemy.level * 10;
          this.gamePlay.clearCell(index);
          this.positionedEnemyChars.delete(index);
        }
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.controlsActive = false;
        this.selectedCharacterIndex = -1;

        this.gamePlay.showDamage(index, damage, () => {
          this.gamePlay.deselectCell(index);
          this.finishTurn('player');
        });
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
        if (currentDistance < minDistance) {
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
      this.gamePlay.showDamage(targetIndex, damage, () => { this.finishTurn('bot'); })
      return;
    } else {
      this.positionedEnemyChars.delete(attackerIndex);
      this.gamePlay.clearCell(attackerIndex);

      let occupiedCellIndexes = [...Array.from(this.positionedPlayerChars.keys()), ...Array.from(this.positionedEnemyChars.keys())]
      let newAttackerIndex = calcBotsTraveling(attacker, attackerIndex, targetIndex, occupiedCellIndexes, this.gamePlay.boardSize);
      this.positionedEnemyChars.set(newAttackerIndex, attacker);
      this.gamePlay.drawPositionedCharacter(newAttackerIndex, attacker);

      this.controlsActive = true;
      this.gamePlay.setCursor("default");
      this.finishTurn('bot');
    }
  }

  finishTurn(whoFinishes) {
    switch (whoFinishes) {
      case 'bot':
        if (Array.from(this.positionedPlayerChars.keys()).length === 0) {
          this.finishSession('welp, you lost. try again maybe');
        }
        this.controlsActive = true;
        this.gamePlay.setCursor("default");
        break;

      case 'player':
        if (Array.from(this.positionedEnemyChars.keys()).length === 0) {
          this.controlsActive = true;
          this.gamePlay.setCursor("default");

          if (this.level == 1) {
            this.finishSession('congrats, you won!');
            return;
          }

          let updatedPlayersTeam = [];
          for (let [position, playerChar] of this.positionedPlayerChars) {
            playerChar.levelUp();
            updatedPlayersTeam.push(playerChar);
          }

          this.level++;
          this.gamePlay.setupBoard(Object.values(themes)[this.level - 1]);
          let newEnemyTeam = generateTeam([Vampire, Undead, Daemon], this.level, 3).characters;

          this.gamePlay.clearAllCells();
          this.layoutCharacters(updatedPlayersTeam, newEnemyTeam);
          this.gamePlay.redrawPositions(this.positionedPlayerChars);
          this.gamePlay.redrawPositions(this.positionedEnemyChars);

          return;
        }
        this.botMakesTurn();
        break;
    }
  }

  finishSession(finalMessage) {
    alert(finalMessage);
    this.gamePlay.clearMouseControls();

    if (this.score > this.highscore) {
      alert(`new highscore achived! \n\n previous: ${this.highscore} \n current: ${this.score}`);
      this.highscore = this.score;
    }

    this.score = 0;
    this.gameOver = true;
  }
}
