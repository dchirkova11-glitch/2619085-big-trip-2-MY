import Observable from '../framework/observable.js';
import { pointsMock } from '../mock/points-mock.js';

export default class PointsModel extends Observable {
  #points = null;

  init() {
    this.#points = [...pointsMock];
  }

  get points() {
    return this.#points;
  }
}
