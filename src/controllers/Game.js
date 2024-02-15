import { Car } from '../models/index.js';
import OutputView from '../views/OutView.js';
import InputController from './InputController.js';
import { OUTPUT_MESSAGE } from '../constants/Message.js';

class Game {
  #carList = [];

  #winner = [];

  #round = {
    total: 0,
    current: 0,
  };

  async #setCarList() {
    const value = await InputController.getCarName();

    if (value) this.#carList = value.split(',').map((name) => new Car(name));
  }

  async #getTotalRound() {
    const value = await InputController.getRoundNumber();

    this.#round.total = Number(value);
  }

  async setGame() {
    await this.#setCarList();
    await this.#getTotalRound();
  }

  #printRoundResult() {
    this.#carList.forEach((car) => {
      const { name, step } = car.getCarInfo();
      const message = `${name} : ${Array.from({ length: step }, () => '-').join(
        '',
      )} `;

      OutputView.printMessage(message);
    });
  }

  play() {
    OutputView.printMessage(`\n${OUTPUT_MESSAGE.roundResult}`);

    while (this.#round.total > this.#round.current) {
      this.#carList.forEach((car) => {
        car.movement();
      });
      OutputView.printMessage('');
      this.#printRoundResult();
      this.#round.current += 1;
    }
  }

  #judgementWinner() {
    const winnerPoint = Math.max(
      ...this.#carList.map((car) => car.getCarInfo().step),
    );

    this.#carList.forEach((car) => {
      const { step, name } = car.getCarInfo();

      if (step === winnerPoint) this.#winner.push(name);
    });
  }

  #printWinner() {
    const message = `\n${OUTPUT_MESSAGE.winner}: ${this.#winner.join(',')}`;

    OutputView.printMessage(message);
  }

  getGameResult() {
    this.#judgementWinner();
    this.#printWinner();
  }
}

export default Game;
