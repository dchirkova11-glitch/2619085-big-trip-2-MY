import { remove, render, replace } from '../framework/render.js';
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
    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;
    this.#pointComponent = new PointView({
      point: this.#point,
      destination,
      typeOffers,
      onEditClick: this.#handleEditClick
    });

    this.#formComponent = new FormView({
      point: this.#point,
      destination,
      typeOffers,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick
    });

    if (prevPointComponent === null || prevFormComponent === null) {
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if (this.#listContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#listContainer.contains(prevFormComponent.element)) {
      replace(this.#formComponent, prevFormComponent);
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formComponent);
  }

  #replacePointToForm() {
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };
}
