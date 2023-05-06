const MAX_AD_PRICE = 100000;
const MIN_AD_PRICE = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000
};

const adForm = document.querySelector('.ad-form');
const formInputs = adForm.querySelectorAll('input');
const formButtons = adForm.querySelectorAll('button');
const mapFilters = document.querySelector('.map__filters');
const titleField = adForm.querySelector('#title');
const priceField = adForm.querySelector('#price');
const typeField = adForm.querySelector('#type');
const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');

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

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'p',
  errorTextClass: 'text-help'
});

pristine.addValidator(titleField, validateAdTitle, 'Заголовок не соответствует правилам');
pristine.addValidator(priceField, validateAdPrice, 'Цена не соответствует правилам');

function validateAdTitle(value) {
  const exp = /[\w\d\s\n\W]{30,100}/i;
  return exp.test(value);
}

function validateAdPrice(value) {
  const exp = /[0-9]/g;
  const minPrice = MIN_AD_PRICE[typeField.value];
  return exp.test(value) && value <= MAX_AD_PRICE && value >= minPrice;
}

typeField.addEventListener('change', () => {
  priceField.placeholder = MIN_AD_PRICE[typeField.value];
  pristine.validate(priceField);
});

timeInField.addEventListener('change', (evt) => {
  const timeOutOptions = timeOutField.querySelectorAll('option');
  timeOutOptions.forEach((option) => {
    option.value == evt.target.value ? option.selected = true : option.selected = false;
  });
});

timeOutField.addEventListener('change', (evt) => {
  const timeInOptions = timeInField.querySelectorAll('option');
  timeInOptions.forEach((option) => {
    option.value == evt.target.value ? option.selected = true : option.selected = false;
  });
});

const setAdFormSubmit = () => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      //место для кода отправки данных на сервер
    }
  });
};

setAdFormSubmit();
