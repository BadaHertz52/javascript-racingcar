import { Car } from '../models/index.js';
import OutputView from '../views/OutView.js';
import InputController from './InputController.js';
import { OUTPUT_MESSAGE } from '../constants/index.js';

class Game {
  #carList = [];

  #winnerList = [];

  #round = {
    total: 0,
    current: 1,
  };

  async #setCarList() {
    const value = await InputController.getCarName();

    if (value) {
      const nameArray = value.split(',');
      this.#carList = nameArray.map((name) => new Car(name));

      OutputView.printMessage(`\n=> 참가 자동차: ${nameArray.join(',')}`);
    }
  }

  async #getTotalRound() {
    const value = await InputController.getRoundNumber();

    this.#round.total = Number(value);

    OutputView.printMessage(
      `\n=> 게임을 진행할 라운드 횟수: ${this.#round.total}`,
    );
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
    OutputView.printMessage(`\n${OUTPUT_MESSAGE.roundResult}\n`);

    while (this.#round.total >= this.#round.current) {
      OutputView.printMessage(`\n라운드:${this.#round.current}\n`);
      // 자동차 전진 판단
      this.#carList.forEach((car) => car.move());
      this.#printRoundResult();
      this.#round.current += 1;
    }
  }

  #getWinnerPoint() {
    return Math.max(...this.#carList.map((car) => car.getCarInfo().step));
  }

  #judgementWinner() {
    const winnerPoint = this.#getWinnerPoint();

    if (winnerPoint) {
      this.#carList.forEach((car) => {
        const { step, name } = car.getCarInfo();

        if (step === winnerPoint) this.#winnerList.push(name);
      });
    }
  }

  #printWinner() {
    const winners = this.#winnerList.join(', ');
    const message = `\n${OUTPUT_MESSAGE.winner}: ${winners || '없음'}`;

    OutputView.printMessage(message);
  }

  getGameResult() {
    this.#judgementWinner();
    this.#printWinner();
  }
}

export default Game;
