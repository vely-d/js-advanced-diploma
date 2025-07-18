import Character from "./Character";

export default class Swordsman extends Character {
    // constructor(level, raiseToLevel=true) {
    // constructor(...args) {
    constructor(level, stamina=4, range=1, attack=40, defence=10, health=50, raiseToLevel=true) {
        // super(level, 'swordsman', 4, 1, 40, 10, raiseToLevel);
        // super(...args);
        super(level, stamina, range, attack, defence, health, 'swordsman', raiseToLevel);
    }
}