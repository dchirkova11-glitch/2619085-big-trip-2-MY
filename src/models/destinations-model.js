import { destinationsMock } from '../mock/destinations-mock';

export default class DestinationsModel {
  #destinations = null;

  init() {
    this.#destinations = [...destinationsMock];
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

}
