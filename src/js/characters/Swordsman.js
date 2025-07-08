import Character from "./Character";

export default class Swordsman extends Character {
    constructor(level) {
        super(level, 'swordsman');
        this.stamina = 4;
        this.range = 1;
        this.attack = 40;
        this.defence = 10;
    }
}