import Bowman from '../../characters/Bowman';
import Character from '../../characters/Character';

describe('Bowman', () => {
    let bowman;

    beforeEach(() => {
        bowman = new Bowman(1); // Create a new Bowman instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(bowman).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(bowman.attack).toBe(25);
        expect(bowman.defence).toBe(25);
        expect(bowman.level).toBe(1);
        expect(bowman.type).toBe('bowman');
    });
});