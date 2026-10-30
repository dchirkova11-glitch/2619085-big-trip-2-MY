import Observable from '../framework/observable.js';
import { pointsMock } from '../mock/points-mock.js';
import { updateItem } from '../utils/common.js';

export default class PointsModel extends Observable {
  #points = null;

  init() {
    this.#points = [...pointsMock];
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    this.#points = updateItem(this.#points, update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }
}
