import Character from "./Character";

export default class Vampire extends Character {
    constructor(level) {
        super(level, 'vampire', 2, 2, 25, 25);
    }
}