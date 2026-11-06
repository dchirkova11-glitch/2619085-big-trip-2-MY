import { render } from '../framework/render.js';
import NewPointButtonView from '../views/new-point-button-view.js';
import FilterPresenter from './filter-presenter.js';
import ListPresenter from './list-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #headerContainer = null;
  #listPresenter = null;
  #newPointButtonComponent = null;

  constructor({
    tripContainer,
    filterContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    headerContainer }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#headerContainer = headerContainer;
  }

  init() {
    this.#listPresenter = new ListPresenter({
      container: this.#tripContainer,
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel,
      onNewPointDestroy: this.#handleNewPointFormClose
    });
    this.#listPresenter.init();

    const filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel
    });
    filterPresenter.init();

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  #handleNewPointButtonClick = () => {
    this.#listPresenter.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };
}
