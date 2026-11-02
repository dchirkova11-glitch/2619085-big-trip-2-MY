import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';
import { remove, render } from '../framework/render.js';
import NoPointView from '../views/no-point-view.js';
import SortView from '../views/sort-view.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortPointByDay, sortPointByPrice, sortPointByTime } from '../utils/point.js';
import { filter } from '../utils/filter.js';

export default class ListPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #listComponent = new ListView();
  #noPointComponent = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ container, pointsModel, offersModel, destinationsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points () {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filterPoints = filter[filterType];
    const filteredPoints = filterPoints(points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...filteredPoints].sort(sortPointByDay);
      case SortType.TIME:
        return [...filteredPoints].sort(sortPointByTime);
      case SortType.PRICE:
        return [...filteredPoints].sort(sortPointByPrice);
    }
    return filteredPoints;
  }

  init() {
    this.#renderList();
  }

  #renderList() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#container);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView ({ filterType: this.#filterModel.filter});
    render(this.#noPointComponent, this.#container);
  }

  #renderPointList() {
    render(this.#listComponent, this.#container);
    this.#renderPoints();
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearList() {
    this.#clearPointList();
    remove(this.#sortComponent);
    remove(this.#listComponent);
    remove(this.#noPointComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.POINT:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.LIST:
        this.#clearList();
        this.#renderList();
        break;
      case UpdateType.ALL:
        this.#currentSortType = SortType.DAY;
        this.#clearList();
        this.#renderList();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

}
