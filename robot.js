class Robot {
  constructor(name, health = 100, damage, location) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.criticalMultiplier = function (multiplier, min = 0.1, max = 0.5) {
      try {
        if (multiplier >= min && multiplier <= max) {
          return multiplier;
        } else throw new Error('Critical Multiplier must be between 1 and 5');
      } catch (e) {
        console.error('\x1b[31m%s\x1b[0m', e.message);
        return '\x1b[33mCheck config.criticalChance() in config.js for debugging\x1b[0m';
      }
    };
    this.location = location;
    this.targets = [];
    this.rechargeTime = function (health) {
      return (1000 * health) / 100;
    };
  }

  doDamage() {
    const allTargets = this.targets.length;
    const randomTarget = Math.floor(Math.random() * allTargets);
    const currentTarget = this.targets[randomTarget];
    this.damageTarget = currentTarget;
  }

  criticalChance(target) {
    const random = Math.floor(Math.random() * 100) + 1;
    if (10 - this.health / 10 >= random) {
      console.log(
        `Critical!! >> ${this.name}(${this.health}) to ${target.name}(${target.health})`
      );
      return true;
    } else {
      return false;
    }
  }

  recharge(task) {
    this.time = this.rechargeTime(this.health);

    setTimeout(task, this.timer);
  }

  set damageTarget(target) {
    this.recharge(() => {
      const critical = this.criticalChance(target);

      if (target.health > 0 && this.health > 0) {
        if (critical)
          target.health =
            target.health - this.damage * this.criticalMultiplier(0.3);
        else target.health = Math.floor(target.health - this.damage);

        console.log(
          `Damage Done >> ${this.name}(${this.health}) to ${target.name}(${target.health})`
        );

        this.doDamage();
      } else if (target.health === 0 && this.health > 0) {
        const loser = this.targets.find(val => val.health > 0);
      }
    });
    this.time = this.rechargeTime(this.health);
  }

  get timer() {
    return this.time;
  }
}

module.exports = Robot;
