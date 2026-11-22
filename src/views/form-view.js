import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { BLANK_POINT, POINT_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatFormDate } from '../utils/point.js';
import { capitalize } from '../utils/common.js';
import dayjs from 'dayjs';

const DATEPICKER_CONFIG = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
};

const createOffersTemplate = (offers, selectedOffers, isDisabled) => (
  offers.map((offer) => {
    const isChecked = selectedOffers.includes(offer.id) ? 'checked' : '';
    return (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" 
          id="event-offer-${offer.id}" 
          type="checkbox" 
          name="event-offer-${offer.id}" 
          ${isChecked}
          ${isDisabled ? 'disabled' : ''}
          data-offer-id="${offer.id}"
        >
        <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${he.encode(offer.title)}</span>&plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `);
  }).join('')
);

const createDestinationTemplate = (destination) => {
  if (!destination) {
    return '';
  }
  const { description, pictures } = destination;

  const picturesTemplate = pictures.length > 0
    ? `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${pictures.map((picture) => `<img class="event__photo" 
            src = "${he.encode(picture.src)}" 
            alt = "${he.encode(picture.description)}">`).join('')}
         </div>
       </div>`
    : '';

  return description || pictures.length > 0
    ? (`<section class="event__section  event__section--destination">
         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
         <p class="event__destination-description">${he.encode(description)}</p>
         ${picturesTemplate}
       </section>`)
    : '';
};

const createFormTemplate = (point, allOffers, destinations, isNewPoint) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    type,
    offers,
    destination: destinationId,
    isDisabled,
    isSaving,
    isDeleting } = point;
  const typeOffers = allOffers.find((offerGroup) => offerGroup.type === type).offers;
  const destination = destinations.find((city) => city.id === destinationId);

  const offersTemplate = typeOffers.length > 0
    ? (`<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
             ${createOffersTemplate(typeOffers, offers, isDisabled)}
          </div>
        </section>`)
    : '';
  const destinationTemplate = createDestinationTemplate(destination);
  const detailsTemplate = offersTemplate || destinationTemplate
    ? (`<section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>`)
    : '';
  const dateTimeStart = formatFormDate(dateFrom);
  const dateTimeEnd = formatFormDate(dateTo);
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';
  return (`
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" 
          width="17" height="17" 
          src="img/icons/${type}.png" 
          alt="Event type icon"
        >
      </label>
      <input class="event__type-toggle  visually-hidden" 
      id="event-type-toggle-1" type="checkbox"
      ${isDisabled ? 'disabled' : ''}
      >
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${POINT_TYPES.map((pointType) => `
            <div class="event__type-item">
              <input 
                id="event-type-${pointType}-1" 
                class="event__type-input  visually-hidden" 
                type="radio" 
                name="event-type" 
                value="${pointType}" ${pointType === type ? 'checked' : ''}
              >
              <label class="event__type-label  event__type-label--${pointType}" 
              for="event-type-${pointType}-1">${capitalize(pointType)}</label>
            </div>
          `).join('')}
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" 
        id="event-destination-1" 
        type="text" 
        name="event-destination" 
        value="${he.encode(destination ? destination.name : '')}" 
        list="destination-list-1"
        ${isDisabled ? 'disabled' : ''}
      >
      <datalist id="destination-list-1">
        ${destinations.map((city) => `<option value="${he.encode(city.name)}"></option>`).join('')}
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" 
        id="event-start-time-1" 
        type="text" 
        name="event-start-time" 
        value="${dateTimeStart}"
        ${isDisabled ? 'disabled' : ''}
      >
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" 
        id="event-end-time-1" 
        type="text" 
        name="event-end-time" 
        value="${dateTimeEnd}"
        ${isDisabled ? 'disabled' : ''}
      >
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" 
        id="event-price-1" 
        type="text" 
        name="event-price" 
        value="${he.encode(String(basePrice))}"
        ${isDisabled ? 'disabled' : ''}
      >
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit" 
      ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      ${isNewPoint ? 'Cancel' : deleteButtonText}
    </button>
    ${isNewPoint ? '' : (`<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`)}
  </header>
     ${detailsTemplate}
  </form>
      `);
};

export default class FormView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;
  #isNewPoint = false;

  constructor({
    point = BLANK_POINT,
    offers,
    destinations,
    onFormSubmit,
    onRollupClick,
    onDeleteClick,
    isNewPoint = false
  }) {
    super();
    this._setState(FormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;
    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(
      this._state,
      this.#offers,
      this.#destinations,
      this.#isNewPoint
    );
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    if(!this.#isNewPoint) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
    }
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    const offersElement = this.element.querySelector('.event__available-offers');
    if (offersElement) {
      offersElement.addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatepickers();
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(FormView.parsePointToState(point));
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...DATEPICKER_CONFIG,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...DATEPICKER_CONFIG,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const isDateToAfterDateFrom = dayjs(this._state.dateTo).isAfter(this._state.dateFrom);
    if(!this._state.destination
      || !this._state.dateFrom
      || !this._state.dateTo
      || !isDateToAfterDateFrom
      || this._state.basePrice <= 0) {
      return;
    }
    this.#handleFormSubmit(FormView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #priceInputHandler = (evt) => {
    const price = evt.target.value.replace(/\D/g, '');
    evt.target.value = price;
    this._setState({
      basePrice: Number(price)
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations
      .find((city) => city.name === evt.target.value);

    if (!selectedDestination) {
      this.updateElement({destination: null});
      return;
    }

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #offersChangeHandler = () => {
    const checkedInputs = this.element.querySelectorAll('.event__offer-checkbox:checked');
    const selectedOfferIds = Array
      .from(checkedInputs)
      .map((input) => input.dataset.offerId);
    this._setState({
      offers: selectedOfferIds
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(FormView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
