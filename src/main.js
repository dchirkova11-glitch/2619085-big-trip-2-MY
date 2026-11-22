import DestinationsModel from './models/destinations-model.js';
import FilterModel from './models/filter-model.js';
import OffersModel from './models/offers-model.js';
import PointsModel from './models/points-model.js';
import TripPresenter from './presenters/trip-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic 1q2w3e4r5t6y7u8';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip1';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainEventsElement = document.querySelector('.trip-events');
const headerElement = document.querySelector('.trip-main');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({pointsApiService});

const offersModel = new OffersModel({pointsApiService});

const destinationsModel = new DestinationsModel({pointsApiService});

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  filterContainer: headerFiltersElement,
  tripContainer: mainEventsElement,
  headerContainer: headerElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel
});

tripPresenter.init();

Promise.all([offersModel.init(), destinationsModel.init()])
  .then(() => pointsModel.init())
  .finally(() => tripPresenter.renderNewPointButton());
