import { offersList } from './data.js';

const cardsContainer = document.querySelector('.map__canvas');
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const getPlaceType = (type) => {
  let result;
  switch (type) {
    case 'flat':
      result = 'Квартира';
      break;

    case 'bungalow':
      result = 'Бунгало';
      break;

    case 'house':
      result = 'Дом';
      break;

    case 'palace':
      result = 'Дворец';
      break;

    case 'hotel':
      result = 'Отель';
      break;

    default:
      result = 'Не указан';
      break;
  }
  return result;
};

const renderCards = (data) => {
  const cardFragment = document.createDocumentFragment();

  data.forEach((entry) => {

    const cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent =
      entry.offer.title ?
      entry.offer.title :
      cardElement.querySelector('.popup__title').classList.add('hidden');

    if (entry.offer.address.lat && entry.offer.address.lng) {
      cardElement.querySelector('.popup__text--address').textContent =
        `Координаты: ${entry.offer.address.lat}, ${entry.offer.address.lng}`;
    } else {
      cardElement.querySelector('.popup__text--address').classList.add('hidden');
    }

    if (entry.offer.price) {
      cardElement.querySelector('.popup__text--price').textContent =
        `${entry.offer.price} ₽/ночь`;
    } else {
      cardElement.querySelector('.popup__text--price').classList.add('hidden');
    }

    cardElement.querySelector('.popup__type').textContent =
      entry.type ?
      getPlaceType(entry.type) :
      cardElement.querySelector('.popup__type').classList.add('hidden');

    if (entry.rooms && entry.guests) {
      cardElement.querySelector('.popup__text--capacity').textContent =
        `${entry.rooms} комнаты для ${entry.guests}`;
    } else {
      cardElement.querySelector('.popup__text--capacity').classList.add('hidden');
    }

    if (entry.checkin && entry.checkout) {
      cardElement.querySelector('.popup__text--time').textContent =
        `Заезд после ${entry.checkin}, выезд до ${entry.checkout}`;
    } else {
      cardElement.querySelector('.popup__text--time').classList.add('hidden');
    }

    if (entry.features.length > 0) {
      cardElement.querySelectorAll('.popup__feature').forEach((feature) => {
        const thisFeature = feature.classList[1].substring(16);
        if (!entry.features.includes(thisFeature)) {
          feature.classList.add('hidden');
        }
      });
    } else {
      cardElement.querySelectorAll('.popup__features').classList.add('hidden');
    }

    cardElement.querySelector('.popup__description').textContent =
      entry.description ?
      entry.description :
      cardElement.querySelector('.popup__description').classList.add('hidden');

    if (entry.photos.length > 0) {
      cardElement.querySelector('.popup__photos').innerHTML = '';
      for (let i = 0; i < entry.photos.length; i++) {
        const img = document.createElement('img');
        img.classList.add('popup__photo');
        img.width = '45';
        img.height = '40';
        img.alt = 'Фотография жилья';
        img.src = entry.photos[i];

        cardElement.querySelector('.popup__photos').appendChild(img);
      }
    } else {
      cardElement.querySelector('.popup__photos').classList.add('hidden');
    }

    cardElement.querySelector('.popup__avatar').src =
      entry.author.avatar ?
      entry.author.avatar :
      cardElement.querySelector('.popup__avatar').classList.add('hidden');

    cardFragment.appendChild(cardElement);
  });

  cardsContainer.appendChild(cardFragment);
};

renderCards(offersList);
