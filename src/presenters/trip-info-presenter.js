import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { sortPointByDay } from '../utils/point.js';
import { getTripCost, getTripDates, getTripTitle } from '../utils/trip-info.js';
import TripInfoView from '../views/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripInfoComponent = null;

  constructor ({ container, pointsModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = [...this.#pointsModel.points].sort(sortPointByDay);
    const prevTripInfoComponent = this.#tripInfoComponent;

    if(points.length === 0) {
      remove(prevTripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      title: getTripTitle(points, this.#destinationsModel.destinations),
      dates: getTripDates(points),
      cost: getTripCost(points, this.#offersModel.offers)
    });

    if(prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => this.init();
}
