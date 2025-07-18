import Character from "./Character";

export default class Vampire extends Character {
    // constructor(level, raiseToLevel=true) {
    // constructor(...args) {
    constructor(level, stamina=2, range=2, attack=25, defence=25, health=50, raiseToLevel=true) {
        // super(level, 'vampire', 2, 2, 25, 25, raiseToLevel);
        // super(...args);
        super(level, stamina, range, attack, defence, health, 'vampire', raiseToLevel);
    }
}