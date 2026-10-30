import { filter } from '../utils/filter.js';
import FilterView from '../views/filter-view.js';
import { render } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    const points = this.#pointsModel.points;
    const filters = Object.entries(filter).map(([type, filterPoints]) => ({
      type,
      count: filterPoints(points).length
    }));

    render(new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    }),
    this.#container);
  }

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.ALL, filterType);
  };
}
