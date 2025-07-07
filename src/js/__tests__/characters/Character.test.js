// Import the classes
// const { AbstractCharacter, Warrior, Mage } = require('./path-to-your-file');
import Character from "../../characters/Character"

describe('AbstractCharacter', () => {
    test('should throw an error when instantiated directly', () => {
        expect(() => { new Character() }).toThrow("");
    });
});
