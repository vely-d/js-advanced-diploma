import Character from "./Character";

export default class Vampire extends Character {
    constructor(level) {
        super(level, 'vampire');
        this.stamina = 2;
        this.range = 2;
        this.attack = 25;
        this.defence = 25;
    }
}