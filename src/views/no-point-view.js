import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createTemplate = (filterType) => (`<p class="trip-events__msg">${NoPointText[filterType]}</p>`);

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTemplate(this.#filterType);
  }
}
