import Swordsman from '../../characters/Swordsman';
import Character from '../../characters/Character';

describe('Swordsman', () => {
    let swordsman;

    beforeEach(() => {
        swordsman = new Swordsman(1); // Create a new Swordsman instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(swordsman).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(swordsman.attack).toBe(40);
        expect(swordsman.defence).toBe(10);
        expect(swordsman.level).toBe(1);
        expect(swordsman.type).toBe('swordsman');
    });
});