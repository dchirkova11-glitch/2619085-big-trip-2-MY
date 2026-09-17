import { render } from '../render.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sorting-view.js';

export default class TripPresenter {
  constructor({ tripContainer, filterContainer }) {
    this.tripContainer = tripContainer;
    this.filterContainer = filterContainer;
  }

  init() {
    const filterComponent = new FilterView();
    render(filterComponent, this.filterContainer);

    const sortComponent = new SortView();
    render(sortComponent, this.tripContainer);

    const editingFormComponent = new EditingFormView();
    render(editingFormComponent, this.tripContainer);

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.tripContainer);
    }
  }

}
