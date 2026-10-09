import { render, replace } from '../framework/render.js';
import FormView from '../views/form-view.js';
import PointView from '../views/point-view.js';

export default class PointPresenter {
  #listContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #point = null;
  #pointComponent = null;
  #formComponent = null;

  constructor({ listContainer, offersModel, destinationsModel }) {
    this.#listContainer = listContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;

    const destination = this.#destinationsModel.getById(this.#point.destination);
    const typeOffers = this.#offersModel.getByType(this.#point.type);
    this.#pointComponent = new PointView({
      point: this.#point,
      destination,
      typeOffers,
      onEditClick: () => this.#replacePointToForm()
    });

    this.#formComponent = new FormView({
      point: this.#point,
      destination,
      typeOffers,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: () => this.#replaceFormToPoint(),
      onRollupClick: () => this.#replaceFormToPoint()
    });

    render(this.#pointComponent, this.#listContainer);
  }

  #replacePointToForm() {
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
  }

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
