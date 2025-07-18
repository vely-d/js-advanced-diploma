import Character from "./Character";

export default class Daemon extends Character {
    constructor(level) {
        super(level, 'daemon', 1, 4, 10, 10);
    }
}