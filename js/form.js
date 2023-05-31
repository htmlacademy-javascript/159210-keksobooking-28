import { checkIsMapInit, renderMarkers, resetMap } from './map.js';
import { getData, sendData } from './api.js';
import { showAlert, isEscapeKey, debounce, setInteractiveElementsAvailability } from './util.js';
import { resetFiltersForm } from './filters.js';

const AD_TITLE_LENGTH = {
  min: 30,
  max: 100
};
const MAX_AD_PRICE = 100000;
const MIN_AD_PRICE = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000
};
const SLIDER_SETS = {
  min: 0,
  max: 100000,
  step: 1000,
  start: 1000
};
const PLACE_CAPACITY = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const adForm = document.querySelector('.ad-form');
const titleField = adForm.querySelector('#title');
const priceField = adForm.querySelector('#price');
const typeField = adForm.querySelector('#type');
const timeInField = adForm.querySelector('#timein');
const timeOutField = adForm.querySelector('#timeout');
const timeInOptions = timeInField.querySelectorAll('option');
const timeOutOptions = timeOutField.querySelectorAll('option');
const sliderElement = adForm.querySelector('#slider');
const roomNumber = adForm.querySelector('#room_number');
const placeCapacity = adForm.querySelector('#capacity');
const submitBtn = adForm.querySelector('.ad-form__submit');
const resetBtn = adForm.querySelector('.ad-form__reset');
const uploadAvatarField = adForm.querySelector('#avatar');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const uploadImagesField = adForm.querySelector('#images');
const imagesPreview = adForm.querySelector('.ad-form__photo');

const modalCases = ['error', 'success'];

const disableForm = () => {
  adForm.classList.add('ad-form--disabled');
  setInteractiveElementsAvailability('input', adForm, true);
  setInteractiveElementsAvailability('button', adForm, true);
};

const enableForm = () => {
  adForm.classList.remove('ad-form--disabled');
  setInteractiveElementsAvailability('input', adForm, false);
  setInteractiveElementsAvailability('button', adForm, false);
};

const blockSubmitBtn = () => {
  submitBtn.disabled = true;
};

const unblockSubmitBtn = () => {
  submitBtn.disabled = false;
};

const closeModal = (result) => {
  document.querySelector(`.${result}`).remove();

  document.removeEventListener('keydown', onDocumentKeydown);
};

const showModal = (result) => {
  const modalTemplate = document.querySelector(`#${result}`)
    .content.querySelector(`.${result}`);
  const modalElement = modalTemplate.cloneNode(true);

  modalElement.addEventListener('click', () => {
    closeModal(result);
  });

  document.body.appendChild(modalElement);

  document.addEventListener('keydown', onDocumentKeydown);
};

const clearForm = () => {
  adForm.reset();
  resetFiltersForm();
  sliderElement.noUiSlider.reset();
};

const onSuccess = () => {
  clearForm();
  showModal('success');
};
const onError = () => showModal('error');

const isModalOpen = (modalName) => {
  const modal = document.querySelector(`.${modalName}`);

  if (modal) {
    return true;
  }
  return false;
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isModalOpen('error')) {
    evt.preventDefault();
  }

  modalCases.forEach((modalCase) => {
    if (isModalOpen(modalCase)) {
      closeModal(modalCase);
    }
  });
}

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'p',
  errorTextClass: 'text-help'
});

const ERROR_MESSAGES = {
  title: 'Длина заголовка должна быть от 30 до 100 символов',
  priceLow: (limit) => `Для указанного типа жилья цена должна быть не менее ${limit} руб.`,
  priceHigh: `Цена не может быть более ${MAX_AD_PRICE} руб.`,
  capacity: 'Cтолько гостей не разместить в таком количестве комнат'
};

function validateAdTitle(value) {
  const exp = /[\w\d\s\n\W]/i;
  return exp.test(value) && value.length >= AD_TITLE_LENGTH.min && value.length <= AD_TITLE_LENGTH.max;
}

function validateAdLowPrice(value) {
  const exp = /[0-9]/g;
  const minPrice = MIN_AD_PRICE[typeField.value];

  return exp.test(value) && value >= minPrice;
}

function validateAdHighPrice(value) {
  const exp = /[0-9]/g;
  return exp.test(value) && value <= MAX_AD_PRICE;
}

function validateCapacity(value) {
  return PLACE_CAPACITY[roomNumber.value].includes(Number(value));
}

const setAdFormSubmit = () => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      const newData = new FormData(evt.target);
      blockSubmitBtn();
      disableForm();
      sendData(newData, onSuccess, onError)
        .then(() => {
          unblockSubmitBtn();
          enableForm();
          resetMap();
        });
      getData(renderMarkers, showAlert);
    }
  });
};

const createImageBlock = (url, parent) => {
  const img = document.createElement('img');
  img.src = url;
  img.width = '70';
  img.height = '70';
  img.style.objectFit = 'contain';
  parent.appendChild(img);
};

const uploadImage = (uploadField, previewBlock, purpose) => {
  const file = uploadField.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((ft) => fileName.endsWith(ft));

  if (matches) {
    if (purpose === 'avatar') {
      previewBlock.src = URL.createObjectURL(file);
    } else if (purpose === 'photo') {
      previewBlock.innerHTML = '';
      createImageBlock(URL.createObjectURL(file), previewBlock);
    }
  }
};

disableForm();

if (checkIsMapInit()) {
  enableForm();
}

pristine.addValidator(titleField, validateAdTitle, ERROR_MESSAGES.title);
pristine.addValidator(priceField, validateAdLowPrice, () => ERROR_MESSAGES.priceLow(MIN_AD_PRICE[typeField.value]));
pristine.addValidator(priceField, validateAdHighPrice, ERROR_MESSAGES.priceHigh);
pristine.addValidator(placeCapacity, validateCapacity, ERROR_MESSAGES.capacity);

timeInField.addEventListener('change', (evt) => {
  timeOutOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

timeOutField.addEventListener('change', (evt) => {
  timeInOptions.forEach((option) => {
    option.selected = option.value === evt.target.value;
  });
});

noUiSlider.create(sliderElement, {
  range: {
    min: SLIDER_SETS.min,
    max: SLIDER_SETS.max,
  },
  start: SLIDER_SETS.start,
  step: SLIDER_SETS.step,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value).toFixed(2);
    },
  },
});

sliderElement.noUiSlider.on('update', () => {
  priceField.value = sliderElement.noUiSlider.get();
  pristine.validate(priceField);
});

priceField.addEventListener('input', () => {
  sliderElement.noUiSlider.set(priceField.value);
  priceField.placeholder = MIN_AD_PRICE[typeField.value];
  pristine.validate(priceField);
});

placeCapacity.addEventListener('change', () => {
  pristine.validate(placeCapacity);
});

roomNumber.addEventListener('change', () => {
  pristine.validate(placeCapacity);
});

resetBtn.addEventListener('click', () => {
  clearForm();
  debounce(() => resetMap())();
});

uploadAvatarField.addEventListener('change', () => {
  uploadImage(uploadAvatarField, avatarPreview, 'avatar');
});

uploadImagesField.addEventListener('change', () => {
  uploadImage(uploadImagesField, imagesPreview, 'photo');
});

setAdFormSubmit();
