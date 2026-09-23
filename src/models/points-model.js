import { pointsMock } from '../mock/points-mock.js';

export default class PointsModel {
  #points = null;

  internalIP() {
    this.#points = [...pointsMock];
  }

  get points() {
    return this.#points;
  }
}
