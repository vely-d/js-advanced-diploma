import Character from "./Character";

export default class Daemon extends Character {
    constructor(level) {
        super(level, 'daemon');
        this.stamina = 1;
        this.range = 4;
        this.attack = 10;
        this.defence = 10;
    }
}