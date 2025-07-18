import Character from "./Character";

export default class Magician extends Character {
    // constructor(level, raiseToLevel=true) {
    // constructor(...args) {
    constructor(level, stamina=1, range=4, attack=10, defence=10, health=50, raiseToLevel=true) {
        // super(level, 'magician', 1, 4, 10, 40, raiseToLevel);
        // super(...args);
        super(level, stamina, range, attack, defence, health, 'magician', raiseToLevel);
    }
}