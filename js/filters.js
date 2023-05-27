import { filterData } from './map.js';
import { debounce } from './util.js';

const PRICE_RANGES = {
  middle: {
    min: 10000,
    max: 50000
  },
  low: {
    max: 10000
  },
  high: {
    min: 50000
  }
};

const DEFAULT_FILTER_VALUE = 'any';

const RERENDER_DELAY = 500;

const filtersForm = document.querySelector('.map__filters');

const currentFilters = {
  type: DEFAULT_FILTER_VALUE,
  price: DEFAULT_FILTER_VALUE,
  rooms: DEFAULT_FILTER_VALUE,
  guests: DEFAULT_FILTER_VALUE,
  features: []
}

filtersForm.addEventListener('change', (evt) => {
  if (evt.target.closest('select')) {
    const chosenFilter = evt.target.closest('select').id.replace(/housing-/g, '');
    const filterValue = evt.target.closest('select').value;

    currentFilters[chosenFilter] = filterValue;
  } else if (evt.target.closest('input')) {
    const chosenFilter = evt.target.closest('input');
    if (chosenFilter.checked) {
      currentFilters.features.push(chosenFilter.value);
    } else {
      const index = currentFilters.features.indexOf(chosenFilter.value);
      currentFilters.features.splice(index, 1);
    }
  }
  debounce(() => filterData(), RERENDER_DELAY)();
});

const filterByType = (data) => {
  return currentFilters.type === DEFAULT_FILTER_VALUE ?
    data :
    data.filter((item) => item.offer.type === currentFilters.type);
};

const filterByPrice = (data) => {
  switch (currentFilters.price) {
    case DEFAULT_FILTER_VALUE:
      return data;

    case 'middle':
      return data.filter((item) =>
        item.offer.price >= PRICE_RANGES.middle.min &&
        item.offer.price < PRICE_RANGES.middle.max);

    case 'low':
      return data.filter((item) => item.offer.price < PRICE_RANGES.low.max);

    case 'high':
      return data.filter((item) => item.offer.price >= PRICE_RANGES.high.min);

    default:
      break;
  }
};

const filterByRooms = (data) => {
  return currentFilters.rooms === DEFAULT_FILTER_VALUE ?
    data :
    data.filter((item) => item.offer.rooms === parseInt(currentFilters.rooms));
};

const filterByGuests = (data) => {
  return currentFilters.guests === DEFAULT_FILTER_VALUE ?
    data :
    data.filter((item) => item.offer.guests === parseInt(currentFilters.guests));
};

const filterByFeatures = (data) => {
  return data.filter((item) => {
    return currentFilters.features.every((feature) => {
      if (item.offer.features)
        return item.offer.features.includes(feature);

      return false;
    });
  });
};

const resetFilters = () => {
  filtersForm.reset();
};

export { currentFilters, filterByType, filterByPrice, filterByRooms, filterByGuests,
  filterByFeatures, resetFilters };
