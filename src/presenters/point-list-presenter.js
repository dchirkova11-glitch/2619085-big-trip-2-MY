import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import NoPointView from '../views/no-point-view.js';

export default class PointListPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #listComponent = new ListView();
  #points = [];

  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderList();
  }

  #renderList() {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#container);
      return;
    }
    render(new SortView(), this.#container);
    render(this.#listComponent, this.#container);
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel
    });
    pointPresenter.init(point);
  }
}
