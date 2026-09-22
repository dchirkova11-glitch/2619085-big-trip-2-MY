import { render } from '../render.js';
import PointView from '../views/point-view.js';
import EditingFormView from '../views/editing-form-view.js';
import FilterView from '../views/filter-view.js';
import SortView from '../views/sorting-view.js';
import ListView from '../views/list-view.js';

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

    const listComponent = new ListView;
    render(listComponent, this.tripContainer);

    const editingFormComponent = new EditingFormView();
    render(editingFormComponent, listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), listComponent.getElement());
    }
  }

}
