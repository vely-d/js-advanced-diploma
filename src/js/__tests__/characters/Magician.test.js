import Magician from '../../characters/Magician';
import Character from '../../characters/Character';

describe('Magician', () => {
    let magician;

    beforeEach(() => {
        magician = new Magician(1); // Create a new Magician instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(magician).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(magician.attack).toBe(10);
        expect(magician.defence).toBe(40);
        expect(magician.level).toBe(1);
        expect(magician.type).toBe('magician');
    });
});