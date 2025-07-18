import Character from "./Character";

export default class Bowman extends Character {
    // constructor(level) {
    // constructor(...args) {
    constructor(level, stamina=2, range=2, attack=25, defence=25, health=50, raiseToLevel=true) {
        // super(level, 2, 2, 25, 25, 50, 'bowman', raiseToLevel);
        // super(...args);
        super(level, stamina, range, attack, defence, health, 'bowman', raiseToLevel);
    }
}