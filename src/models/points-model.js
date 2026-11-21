import Observable from '../framework/observable.js';
import { pointsMock } from '../mock/points-mock.js';
import { updateItem } from '../utils/common.js';

export default class PointsModel extends Observable {
  #points = null;
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#pointsApiService.points.then((points) => console.log(points));
  }

  get points() {
    return this.#points;
  }

  init() {
    this.#points = [...pointsMock];
  }

  updatePoint(updateType, update) {
    this.#points = updateItem(this.#points, update);
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }
}
