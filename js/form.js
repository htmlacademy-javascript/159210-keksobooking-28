const adForm = document.querySelector('.ad-form');
const formInputs = adForm.querySelectorAll('input');
const formButtons = adForm.querySelectorAll('button');
const mapFilters = document.querySelector('.map__filters');

const setInteractiveElementsAvalibility =
  (selector, container = document, state = true) => {
    container.querySelectorAll(selector).forEach((element) => {
      element.disabled = state;
    });
};

const disableForm = () => {
  adForm.classList.add('ad-form--disabled');
  setInteractiveElementsAvalibility('input', adForm, false);
  setInteractiveElementsAvalibility('button', adForm, false);
};

const disableMapFilters = () => {
  mapFilters.classList.add('map__filters--disabled');
  setInteractiveElementsAvalibility('select', mapFilters, false);
  setInteractiveElementsAvalibility('fieldset', mapFilters, false);
};

const enableForm = () => {
  adForm.classList.remove('ad-form--disabled');
  setInteractiveElementsAvalibility('input', adForm, true);
  setInteractiveElementsAvalibility('button', adForm, true);
};

const enableMapFilters = () => {
  adForm.classList.remove('map__filters--disabled');
  setInteractiveElementsAvalibility('select', mapFilters, true);
  setInteractiveElementsAvalibility('fieldset', mapFilters, true);
};

disableForm();
disableMapFilters();
