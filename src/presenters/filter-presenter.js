import { filter } from '../utils/filter.js';
import FilterView from '../views/filter-view.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = this.#pointsModel.points;
    const filters = Object.entries(filter).map(([type, filterPoints]) => ({
      type,
      count: filterPoints(points).length
    }));

    render(new FilterView({filters}), this.#container);
  }
}
