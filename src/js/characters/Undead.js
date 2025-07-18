import Character from "./Character";

export default class Undead extends Character {
    constructor(level) {
        super(level, 'undead', 4, 1, 40, 10);
    }
}