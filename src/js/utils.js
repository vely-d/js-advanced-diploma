/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // parts of desired string
  let xPosition = "";
  let yPosition = "";
  
  // figure out horizontal part
  if (index % boardSize === 0) {
    xPosition = "left";
  }
  else if (index % boardSize === boardSize - 1) {
    xPosition = "right";
  }

  // figure out vertical part
  if (Math.floor(index / boardSize) === 0) {
    yPosition = "top";
  }
  else if (Math.floor(index / boardSize) === boardSize - 1) {
    yPosition = "bottom";
  }

  // construct desired string of non-empty parts. if both parts are empty - return "center"
  if (xPosition === "" && yPosition === "") {
    return "center"
  }
  else if (yPosition === "") {
    return xPosition
  }
  else if (xPosition === "") {
    return yPosition
  }
  else {
    return `${yPosition}-${xPosition}`
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
