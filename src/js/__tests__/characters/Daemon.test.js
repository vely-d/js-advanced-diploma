import Daemon from '../../characters/Daemon';
import Character from '../../characters/Character';

describe('Daemon', () => {
    let daemon;

    beforeEach(() => {
        daemon = new Daemon(1); // Create a new Daemon instance with level 1
    });

    test('should be an instance of Character', () => {
        expect(daemon).toBeInstanceOf(Character);
    });

    test('should have appropriate characteristics', () => {
        expect(daemon.attack).toBe(10);
        expect(daemon.defence).toBe(40);
        expect(daemon.level).toBe(1);
        expect(daemon.type).toBe('daemon');
    });
});