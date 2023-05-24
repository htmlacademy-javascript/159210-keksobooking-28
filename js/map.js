import { offersList } from './data.js';
import { PLACE_TYPES } from './render-blocks.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DEFAULT_ZOOM = 12;
const addressField = document.querySelector('#address');

const DEFAULT_COORDINATES = {
  lat: 35.68950,
  lng: 139.69171,
};

let isMapInit = false;

const MAIN_ICON_CONFIG = {
  url: './img/main-pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52,
};

const ICON_CONFIG = {
  url: './img/pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52,
};

const setAddress = (lat, lng) => {
  addressField.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
};

setAddress(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);

const map = L.map('map-canvas')
  .on('load', () => {
    isMapInit = true;
  })
  .setView(DEFAULT_COORDINATES, DEFAULT_ZOOM);

const mainPinIcon = L.icon({
  iconUrl: MAIN_ICON_CONFIG.url,
  iconSize: [MAIN_ICON_CONFIG.width, MAIN_ICON_CONFIG.height],
  iconAnchor: [MAIN_ICON_CONFIG.anchorX, MAIN_ICON_CONFIG.anchorY],
});

const pinIcon = L.icon({
  iconUrl: ICON_CONFIG.url,
  iconSize: [ICON_CONFIG.width, ICON_CONFIG.height],
  iconAnchor: [ICON_CONFIG.anchorX, ICON_CONFIG.anchorY],
});

const mainMarker = L.marker(DEFAULT_COORDINATES, {
  draggable: true,
  icon: mainPinIcon,
});

L.tileLayer(TILE_LAYER, {
  attribution: COPYRIGHT
}).addTo(map);

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const adress = evt.target.getLatLng();
  setAddress(adress.lat, adress.lng);
});

const createCustomPopup = (entry) => {
  const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
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
      PLACE_TYPES[entry.type] :
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

  return cardElement;
};

console.log(offersList);

offersList.forEach((entry) => {
  const marker = L.marker({
    lat: entry.offer.address.lat,
    lng: entry.offer.address.lng
  },
  {
    icon: pinIcon,
  });

   marker
    .addTo(map)
    .bindPopup(createCustomPopup(entry));
});

export { isMapInit };
