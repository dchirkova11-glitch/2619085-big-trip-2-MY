import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import FormView from '../views/form-view.js';

export default class NewPointPresenter {
  #listContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #formComponent = null;

  constructor({ listContainer, offersModel, destinationsModel, onDataChange, onDestroy }) {
    this.#listContainer = listContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }


  init() {
    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new FormView({
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
      isNewPoint: true
    });

    render(this.#formComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if(this.#formComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#formComponent);
    this.#formComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.LIST,
      {id: crypto.randomUUID(), ...point}
    );
    this.destroy();
  };
}
