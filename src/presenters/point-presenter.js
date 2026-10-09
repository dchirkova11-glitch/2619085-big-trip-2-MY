import { render } from '../framework/render.js';
import FormView from '../views/form-view.js';
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

    const destination = this.#destinationsModel.getById(this.#point.destination);
    const typeOffers = this.#offersModel.getByType(this.#point.type);
    const pointComponent = new PointView({
      point: this.#point,
      destination,
      typeOffers
    });

    const formComponent = new FormView({
      point: this.#point,
      destination,
      typeOffers,
      destinations: this.#destinationsModel.destinations
    });

    render(pointComponent, this.#listContainer);
  }
}
