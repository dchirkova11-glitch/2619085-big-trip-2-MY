export default class DestinationsModel {
  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
