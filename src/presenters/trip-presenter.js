import { render } from '../render.js';
import EditFormView from '../views/edit-form-view.js';
import FilterView from '../views/filter-view.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';

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

    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#tripContainer);
    render(this.#listComponent, this.#tripContainer);

    render(new EditFormView({ point: this.#tripPoints[0] }), this.#listComponent.getElement());

    for (let i = 1; i < this.#tripPoints.length; i++) {
      const pointPresenter = new PointPresenter({
        listContainer: this.#listComponent.getElement(),
        offersModel: this.#offersModel,
        destinationsModel: this.#destinationsModel
      });
      pointPresenter.init(this.#tripPoints[i]);
    }
  }
}
