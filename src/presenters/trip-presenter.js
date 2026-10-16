import FilterPresenter from './filter-presenter.js';
import ListPresenter from './list-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({ tripContainer, filterContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    const listPresenter = new ListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });
    listPresenter.init();

    const filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      pointsModel: this.#pointsModel
    });
    filterPresenter.init();
  }
}
