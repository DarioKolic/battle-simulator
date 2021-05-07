const config = require('./config');
const Robot = require('./robot');

class Playground {
  constructor(distanceLimit = 5, numberOfPlayers, players) {
    this.distanceLimit = distanceLimit;
    this.numberOfPlayers = numberOfPlayers;
    this.players = players;
    this.robots;
    this.targets = [];
  }

  init() {
    if (this.players) {
      const robots = this.players.map(val => {
        const location = Math.floor(Math.random() * config.locationLimit) + 1;
        return new Robot(val, config.baseHealth, config.damage, location);
      });

      this.robots = robots;
    }
    return true;
  }

  arena() {
    let counter = 1;
    this.playground = [];
    do {
      this.robots.forEach((val, i) => {
        if (val.location === counter) {
          const robot = this.robots.pop();
          this.playground.push(robot);
          this.targets.push(this.playground.length - 1);
        }
      });

      counter++;
      if (counter === this.distanceLimit) {
        counter = 1;
      }
    } while (this.robots.length);

    console.log('\x1b[32m%s\x1b[0m', 'Arena >> Initialized');
  }

  battle() {
    this.arena();

    this.playground.forEach((val, i) => {
      if (val !== 'o') {
        const target = Math.floor(Math.random() * this.targets.length);

        this.targets.forEach(index => {
          if (index !== i) {
            val.targets.push(this.playground[index]);
          }
        });
      }
    });

    this.playground.forEach(val => {
      if (val !== 'o') val.doDamage();
    });
  }
}

const playground = new Playground(5, config.players.length, config.players);
playground.init();
playground.battle();
