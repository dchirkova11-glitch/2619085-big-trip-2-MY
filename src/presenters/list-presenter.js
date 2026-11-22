import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';
import { remove, render } from '../framework/render.js';
import NoPointView from '../views/no-point-view.js';
import SortView from '../views/sort-view.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { sortPointByDay, sortPointByPrice, sortPointByTime } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../views/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import LoadErrorView from '../views/load-error-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class ListPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #newPointPresenter = null;
  #noPointComponent = null;
  #listComponent = new ListView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #loadingComponent = new LoadingView();
  #loadErrorComponent = new LoadErrorView();
  #isLoadError = false;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({
    container,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    onNewPointDestroy
  }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newPointPresenter = new NewPointPresenter({
      listContainer: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
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
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.#isLoadError) {
      this.#renderLoadError();
      return;
    }

    if(this.points.length === 0) {
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

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.ALL, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
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
    this.#newPointPresenter.destroy();
    this.#clearPointList();
    remove(this.#sortComponent);
    remove(this.#noPointComponent);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#isLoadError = data.isError
        || this.#offersModel.offers.length === 0
        || this.#destinationsModel.destinations.length === 0;
        this.#clearList();
        this.#renderList();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderLoadError() {
    render(this.#loadErrorComponent, this.#container);
  }
}
