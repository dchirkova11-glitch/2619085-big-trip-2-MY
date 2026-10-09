import FormView from '../views/form-view.js';
import FilterView from '../views/filter-view.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';

export default class TripPresenter {
  #listComponent = new ListView();
  #tripContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPoints = [];

  constructor({ tripContainer, filterContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripContainer = tripContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    const formPoint = this.#tripPoints[0];
    const formDestination = this.#destinationsModel.getById(formPoint.destination);
    const formTypeOffers = this.#offersModel.getByType(formPoint.type);

    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#tripContainer);
    render(this.#listComponent, this.#tripContainer);

    render(new FormView({
      point: formPoint,
      destination: formDestination,
      typeOffers: formTypeOffers,
      destinations: this.#destinationsModel.destinations
    }), this.#listComponent.element);

    this.#tripPoints.forEach((point) => {
      const pointPresenter = new PointPresenter({
        listContainer: this.#listComponent.element,
        offersModel: this.#offersModel,
        destinationsModel: this.#destinationsModel
      });
      pointPresenter.init(point);
    });

  }
}

