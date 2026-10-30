import FilterPresenter from './filter-presenter.js';
import ListPresenter from './list-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  constructor({
    tripContainer,
    filterContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
  }

  init() {
    const listPresenter = new ListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel
    });
    listPresenter.init();

    const filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel
    });
    filterPresenter.init();
  }
}
