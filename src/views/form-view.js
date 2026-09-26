import { BLANK_POINT, POINT_TYPES } from '../const.js';
import { createElement } from '../render.js';
import { capitalize, formDate } from '../utils.js';

const createOffersTemplate = (offers, selectedOffers) => (
  offers.map((offer) => {

    const isChecked = selectedOffers.includes(offer.id) ? 'checked' : '';

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
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
           ${pictures.map((pic) => `<img class="event__photo" src = "${pic.src}" alt = "${pic.description}">`).join('')}
         </div>
       </div>`
    : '';

  return description || pictures.length > 0
    ? `<section class="event__section  event__section--destination">
         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
         <p class="event__destination-description">${description}</p>
         ${picturesTemplate}
       </section>`
    : '';
};

const createFormTemplate = (point, destination, typeOffers, destinations) => {
  const { basePrice, dateFrom, dateTo, type, offers } = point;

  const offersTemplate = typeOffers && typeOffers.length > 0
    ? createOffersTemplate(typeOffers, offers)
    : '';

  const destinationTemplate = createDestinationTemplate(destination);

  const dateTimeStart = formDate(dateFrom);
  const dateTimeEnd = formDate(dateTo);

  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${POINT_TYPES.map((pointType) => `
                <div class="event__type-item">
                <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${capitalize(pointType)}</label>
              </div>
                `).join('')}


            </fieldset>
          </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((city) => `<option value="${city.name}"></option>`).join('')}
          </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>
${destinationTemplate}

      </form>
      `;
};

export default class FormView {
  #point = null;
  #destination = null;
  #typeOffers = null;
  #destinations = null;

  constructor({ point = BLANK_POINT, destination, typeOffers, destinations }) {
    this.#point = point;
    this.#destination = destination;
    this.#typeOffers = typeOffers;
    this.#destinations = destinations;

  }

  getTemplate() {
    return createFormTemplate(this.#point, this.#destination, this.#typeOffers, this.#destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
