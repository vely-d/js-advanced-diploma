import Team from '../Team';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';

import { getCharacterGenerator, generateTeam } from "../generators";

describe('getCharacterGenerator', () => {
    test('should yield instances of allowed types with random levels', () => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        const maxLevel = 5;
        const generator = getCharacterGenerator(allowedTypes, maxLevel);

        const character1 = generator.next().value;
        const character2 = generator.next().value;

        // Check that the yielded characters are instances of the allowed types
        expect(allowedTypes).toContain(character1.constructor);
        expect(allowedTypes).toContain(character2.constructor);
        expect(character1.level).toBeGreaterThan(0);
        expect(character1.level).toBeLessThanOrEqual(maxLevel);
        expect(character2.level).toBeGreaterThan(0);
        expect(character2.level).toBeLessThanOrEqual(maxLevel);
    });
});

describe('generateTeam', () => {
    test('should generate a team with the correct number of characters', () => {
        const allowedTypes = [Bowman, Swordsman, Magician, Vampire, Undead, Daemon];
        const maxLevel = 5;
        const characterCount = 3;

        const team = generateTeam(allowedTypes, maxLevel, characterCount);

        // Check the type of returned value
        expect(team).toBeInstanceOf(Team);
        // Check that the team has the correct number of characters
        expect(team.characters.length).toBe(characterCount);
        team.characters.forEach(character => {
            expect(character.level).toBeGreaterThan(0);
            expect(character.level).toBeLessThanOrEqual(maxLevel);
            expect(allowedTypes).toContain(character.constructor);
        });
    });
});
