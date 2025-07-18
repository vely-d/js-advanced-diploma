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

export function indexDistance(i1, i2, boardSize) {
    let coord1 = indexToCoordinates(i1, boardSize)
    let coord2 = indexToCoordinates(i2, boardSize)
    let dx = coord1.x - coord2.x
    let dy = coord1.y - coord2.y
    return Math.sqrt(dx * dx + dy * dy)
}

export function canAttack(attacker, attackerIndex, targetIndex, boardSize) {
    let attackerCoords = indexToCoordinates(attackerIndex, boardSize);
    let targetCoords = indexToCoordinates(targetIndex, boardSize);
    let attackVector = {
        x: targetCoords.x - attackerCoords.x,
        y: targetCoords.y - attackerCoords.y
    };
    return (getAngle(attackVector) % 45 == 0 && Math.abs(attackVector.x) <= attacker.range && Math.abs(attackVector.y) <= attacker.range);
}

export function Damage(attacker, target) {
    return Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1))
}

function directionByAngle(angle) {
    const directions = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 }
    ];

    // let posAngle = angle >= 0 ? angle : angle + Math.ceil(-angle / 360) * 360
    angle = angle >= 0 ? angle : angle + Math.ceil(-angle / 360) * 360

    const index = Math.floor(((angle + 22.5) % 360) / 45);
    return directions[index];
}

export function calcBotsTraveling(botChar, botIndex, targetIndex, occupiedIndexes, boardSize) {
    // chosing the best and two second best directions to approach the target
    let botCoords = indexToCoordinates(botIndex, boardSize);
    let targetCoords = indexToCoordinates(targetIndex, boardSize);
    let exactVector = {
        x: targetCoords.x - botCoords.x,
        y: targetCoords.y - botCoords.y
    }
    let exactTravelingAngle = getAngle(exactVector)
    let movingDirections = [exactTravelingAngle - 45, exactTravelingAngle, exactTravelingAngle + 45].map(angle => directionByAngle(angle))

    // picking the closest move, constructed of distance and direction
    let bestMove = botIndex
    let closestDistance = Infinity
    for (let moveLenght = botChar.stamina; moveLenght >= 1; moveLenght--) {
        for (let direction of movingDirections) {
            let moveCoords = {
                x: botCoords.x + direction.x * moveLenght,
                y: botCoords.y + direction.y * moveLenght,
            }
            if (moveCoords.x < 0 || moveCoords.y < 0 || moveCoords.x >= boardSize || moveCoords.y >= boardSize) {
                continue
            }
            let move = coordinatesToIndex(moveCoords.x, moveCoords.y, boardSize)
            if (occupiedIndexes.includes(move)) {
                continue
            }
            let currentDistance = indexDistance(move, targetIndex, boardSize)
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance
                bestMove = move
            }
        }
    }

    return bestMove
}