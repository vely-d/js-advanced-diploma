import Undead from '../../characters/Undead';
import Character from '../../characters/Character';

describe('Undead', () => {
    let undead;

    beforeEach(() => {
        undead = new Undead(1); // Create a new Undead instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(undead).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(undead.attack).toBe(40);
        expect(undead.defence).toBe(10);
        expect(undead.level).toBe(1);
        expect(undead.type).toBe('undead');
    });
});