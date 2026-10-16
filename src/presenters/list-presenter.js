import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import NoPointView from '../views/no-point-view.js';
import SortView from '../views/sort-view.js';

export default class ListPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = new SortView();
  #listComponent = new ListView();
  #noPointComponent = new NoPointView();
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
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
  }

  #renderSort() {
    render(this.#sortComponent, this.#container);
  }

  #renderPoints() {
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

  #renderNoPoints() {
    render(this.#noPointComponent, this.#container);
  }

  #renderPointList() {
    render(this.#listComponent, this.#container);
    this.#renderPoints();
  }
}
