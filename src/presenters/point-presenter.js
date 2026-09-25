import { render } from '../render.js';
import PointView from '../views/point-view.js';

export default class PointPresenter {
  #listContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #point = null;

  constructor({ listContainer, offersModel, destinationsModel }) {
    this.#listContainer = listContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;

    render(
      new PointView({ point: this.#point }),
      this.#listContainer
    );

  }
}
