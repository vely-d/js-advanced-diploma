/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, stamina, range, attack, defence, health=50, type = 'generic', raiseToLevel=false) {
    if (new.target === Character) {
      throw new Error('Cannot instantiate an abstract class: Character');
    }

    this.stamina = stamina;
    this.range = range;
    this.attack = attack;
    this.defence = defence;
    this.health = health;
    this.type = type;
    this.level = 1;

    if(raiseToLevel) {
      for(let i = 1; i < level; i++) {
        this.levelUp();
      }
    } else {
      this.level = level
    }
  }

  levelUp() {
    this.level++;
    this.attack = Math.max(this.attack, Math.floor(this.attack * (80 + this.health) / 100));
    this.defence = Math.max(this.defence, Math.floor(this.defence * (80 + this.health) / 100));
    this.health += this.health < 20 ? 80 : 100 - this.health;
  }

  // static from(object) {
  //   // let char = new Character(0, 'generic', 1, 1, 10, 10, 50)
  //   return new Character({ ...object })
  // }
}
