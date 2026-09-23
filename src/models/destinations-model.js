import { destinationsMock } from '../mock/destinations-mock';

export default class DestinationsModel {
  #destinations = null;

  internalIP() {
    this.#destinations = [...destinationsMock];
  }

  get destinations() {
    return this.#destinations;
  }
}
