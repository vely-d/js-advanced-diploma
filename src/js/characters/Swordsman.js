import Character from "./Character";

export default class Swordsman extends Character {
    constructor(level) {
        super(level, 'swordsman', 4, 1, 40, 10);
    }
}