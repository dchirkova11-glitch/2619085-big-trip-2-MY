import FilterView from '../views/filter-view.js';
import { render } from '../framework/render.js';
import PointListPresenter from './point-list-presenter.js';

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
    this.#renderFilters();
    const pointListPresenter = new PointListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });
    pointListPresenter.init();
  }

  #renderFilters() {
    render(new FilterView(), this.#filterContainer);
  }
}
