import Character from "./Character";

export default class Magician extends Character {
    constructor(level) {
        super(level, 'magician');
        this.stamina = 1;
        this.range = 4;
        this.attack = 10;
        this.defence = 40;
    }
}