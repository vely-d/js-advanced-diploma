import Vampire from '../../characters/Vampire';
import Character from '../../characters/Character';

describe('Vampire', () => {
    let vampire;

    beforeEach(() => {
        vampire = new Vampire(1); // Create a new Vampire instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(vampire).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(vampire.attack).toBe(25);
        expect(vampire.defence).toBe(25);
        expect(vampire.level).toBe(1);
        expect(vampire.type).toBe('vampire');
    });
});