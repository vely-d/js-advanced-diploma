export function indexToCoordinates(index, boardSize) {
    return {
        x: index % boardSize,
        y: Math.floor(index / boardSize)
    };
}

export function coordinatesToIndex(x, y, boardSize) {
    return y * boardSize + x;
}

export function getAngle(coords) {
    let { x, y } = coords;
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}