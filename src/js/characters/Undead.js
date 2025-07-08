import Character from "./Character";

export default class Undead extends Character {
    constructor(level) {
        super(level, 'undead');
        this.stamina = 4;
        this.range = 1;
        this.attack = 40;
        this.defence = 10;
    }
}