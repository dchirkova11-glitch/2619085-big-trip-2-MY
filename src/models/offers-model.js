import { offersMock } from '../mock/offers-mock.js';

export default class OffersModel {
  #offers = null;

  init() {
    this.#offers = [...offersMock];
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offerGroup) => offerGroup.type === type).offers;
  }
}
