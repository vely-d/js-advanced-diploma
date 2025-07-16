import { calcHealthLevel, calcTileType } from './utils.js';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.damageEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
    
    this.hintEl = null;
    this.damageAnimationDuration = 500;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <!-- <div data-id="board" class="board"></div> -->
        <div data-id="board" class="board" data-size="${this.boardSize}"></div>
      </div>
      <span id="hint" class="char-stats-hint char-stats-hint__hidden hidden"></span>
      <!-- <span id="damage-badge" class="damage"></span> -->
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);

    document.documentElement.style.setProperty('--fade-duration', `${this.damageAnimationDuration}ms`)
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    // for (const cell of this.cells) {
    //   cell.innerHTML = '';
    // }

    // for (const position of positions) {
    for (const [position, character] of positions) {
      // const cellEl = this.boardEl.children[position.position];
      const cellEl = this.boardEl.children[position];
      cellEl.innerHTML = '';
      const charEl = document.createElement('div');
      // charEl.classList.add('character', position.character.type);
      charEl.classList.add('character', character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      // healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(character.health)}`);
      // healthIndicatorEl.style.width = `${position.character.health}%`;
      healthIndicatorEl.style.width = `${character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  clearCell(index) {
    const cellEl = this.boardEl.children[index];
    cellEl.innerHTML = '';
  }

  drawPositionedCharacter(position, character) {
    const cellEl = this.boardEl.children[position];
    cellEl.innerHTML = '';
    const charEl = document.createElement('div');
    // charEl.classList.add('character', position.character.type);
    charEl.classList.add('character', character.type);

    const healthEl = document.createElement('div');
    healthEl.classList.add('health-level');

    const healthIndicatorEl = document.createElement('div');
    // healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
    healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(character.health)}`);
    // healthIndicatorEl.style.width = `${position.character.health}%`;
    healthIndicatorEl.style.width = `${character.health}%`;
    healthEl.appendChild(healthIndicatorEl);

    charEl.appendChild(healthEl);
    cellEl.appendChild(charEl);
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected')));
  }

  // -------------------------
  // My implementation of hint
  // -------------------------

  /**
   * Set's up  the hint element. should be invoked just once
   */
  getHint() {
    let hint = document.getElementById('hint');
    if (!(hint instanceof HTMLElement)) {
      throw new Error('Can not find hint element');
    }
    this.hintEl = hint;
  }

  /**
   * Makes hint element invisible
   */
  hideHint() {
    // this.hintEl.classList.add('hidden');
    this.hintEl.classList.add('char-stats-hint__hidden');
  }

  /**
   * Shows hint element
   */
  showHint() {
    // this.hintEl.classList.remove('hidden');
    this.hintEl.classList.remove('char-stats-hint__hidden');
  }
  
  moveHint(index) {
    // let { top, left, right, bottom } = this.boardEl.children[index].getBoundingClientRect();
    let cellRect = this.boardEl.children[index].getBoundingClientRect();
    let hintRect = this.hintEl.getBoundingClientRect();

    let hintX = cellRect.left + cellRect.width / 2 - hintRect.width / 2;
    let hintY = cellRect.top - hintRect.height - 10;

    this.hintEl.style.setProperty('left', `${hintX}px`);
    this.hintEl.style.setProperty('top', `${hintY}px`);
  }

  // getDamageBadge() {
  //   let damageBadge = document.getElementById('damage-badge');
  //   if (!(damageBadge instanceof HTMLElement)) {
  //     throw new Error('Can not find damage badge element');
  //   }
  //   this.damageEl = damageBadge;
  // }

  // showDamage(index, damage) {
  //   this.damageEl.textContent = `-${damage}ОЗ`;
  //   this.damageEl.classList.add('damage_animated');
  // }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage, callback) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', async () => {
        cell.removeChild(damageEl);
        await (new Promise((innerResolve) => setTimeout(() => { innerResolve(); }, this.damageAnimationDuration)));
        resolve();
        callback();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
