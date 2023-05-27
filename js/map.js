import { getData } from './api.js';
import { showAlert } from './util.js';
import { filterByType, filterByPrice, filterByRooms, filterByGuests,
  filterByFeatures } from './filters.js';

const PLACE_TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель'
};

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DEFAULT_ZOOM = 12;

const DEFAULT_COORDINATES = {
  lat: 35.68950,
  lng: 139.69171,
};

const MAIN_ICON_CONFIG = {
  url: './img/main-pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52,
};

const ICON_CONFIG = {
  url: './img/pin.svg',
  width: 40,
  height: 40,
  anchorX: 20,
  anchorY: 40,
};

const MAX_MARKERS = 10;

const addressField = document.querySelector('#address');

let isMapInit = false;

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

  if (entry.offer.address) {
    cardElement.querySelector('.popup__text--address').textContent =
      `Адрес: ${entry.offer.address}`;
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
    entry.offer.type ?
    PLACE_TYPES[entry.offer.type] :
      cardElement.querySelector('.popup__type').classList.add('hidden');

  if (entry.offer.rooms && entry.offer.guests) {
    cardElement.querySelector('.popup__text--capacity').textContent =
      `${entry.offer.rooms} комнаты для ${entry.offer.guests}`;
  } else {
    cardElement.querySelector('.popup__text--capacity').classList.add('hidden');
  }

  if (entry.offer.checkin && entry.offer.checkout) {
    cardElement.querySelector('.popup__text--time').textContent =
      `Заезд после ${entry.offer.checkin}, выезд до ${entry.offer.checkout}`;
  } else {
    cardElement.querySelector('.popup__text--time').classList.add('hidden');
  }

  if (entry.offer.features) {
    cardElement.querySelectorAll('.popup__feature').forEach((feature) => {
      const thisFeature = feature.classList[1].substring(16);
      if (!entry.offer.features.includes(thisFeature)) {
        feature.classList.add('hidden');
      }
    });
  } else {
    cardElement.querySelector('.popup__features').classList.add('hidden');
  }

  cardElement.querySelector('.popup__description').textContent =
    entry.offer.description ?
    entry.offer.description :
      cardElement.querySelector('.popup__description').classList.add('hidden');

  if (entry.offer.photos) {
    cardElement.querySelector('.popup__photos').innerHTML = '';
    for (let i = 0; i < entry.offer.photos.length; i++) {
      const img = document.createElement('img');
      img.classList.add('popup__photo');
      img.width = '45';
      img.height = '40';
      img.alt = 'Фотография жилья';
      img.src = entry.offer.photos[i];

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

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (entry) => {
  const marker = L.marker({
      lat: entry.location.lat,
      lng: entry.location.lng
    },
    {
      icon: pinIcon,
    });

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(entry));
};

function renderMarkers(items) {
  items.forEach((item) => {
    createMarker(item);
  });
}

let ads = [];
let filteredAds = [];

const initData = (data) => {
  ads = data;
  rerenderMarkers(ads);
};

const filterData = () => {
  filteredAds = filterByFeatures(filterByGuests(filterByRooms(filterByPrice(filterByType(ads)))));

  rerenderMarkers(filteredAds);
};

const rerenderMarkers = (data) => {
  markerGroup.clearLayers();
  renderMarkers(data.slice(0, MAX_MARKERS), markerGroup);
};

getData(initData, showAlert);

function resetMap() {
  if (document.querySelector('.leaflet-popup')) {
    document.querySelector('.leaflet-popup').remove();
  }

  map.setView(DEFAULT_COORDINATES, DEFAULT_ZOOM);
  mainMarker.setLatLng(DEFAULT_COORDINATES);
  setAddress(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);
}

export { isMapInit, renderMarkers, filterData, resetMap };
