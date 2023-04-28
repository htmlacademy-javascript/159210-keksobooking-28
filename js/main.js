const AD_COUNT = 10;
const AD_TITLES = ['Сдам хату',
  'Хижина дяди Тома',
  'Рай в шалаше',
  'Дворец без бракосочетаний',
  'Дупло с совами',
  'Сдам на лето берлогу',
  'Комната, из которой не выйти',
  'Кукушкино гнездо',
  'Гнездо, но осиное',
  'Улей для королев',
  'Хлев (просьба не рожать религиозных деятелей)'];

const AD_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const AD_CHECKINS = ['12:00', '13:00', '14:00'];
const AD_CHECKOUTS = ['12:00', '13:00', '14:00'];
const AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

const AD_DESCRIPTION = ['Огромная комната с едва освещающими её высшими силами, обои были порваны, клочья которых свисали со стен обнажая старые бетонные панели, клубы земли разбросанные по углам разносили затхлый запах болота пронизывающий всю комнату.',
  'Много странных усыпанных по комнате камней со странными рисунками привлекали ваше внимание, по левую сторону от входа была старая дверь.',
  'Большая комната с не сильно освещающим её чем угодно, но только не люстрой зачем-то весящей на стене комнаты, стены которой были выложены старыми бетонными панелями, среди множества книг, полок и шкафов выделялась книга, большая советская энциклопедия.',
  'Маленькая комната с слабо освещающей её люстрой, на стенах были белые меловые рисунки, по всем стенам и потолку висели сломанные лампы и фонарики, большие напольные часы рушили давящую тишину громким тиканьем отмеряющим секунды.',
  'Не определённых размеров комната с слабо освещающим её уличным фонарём на другой стороне улицы, стены которой были выложены старыми бетонными панелями, по полу было всё усыпано затхлой листвой.',
  'Много странных усыпанных по комнате камней со странными рисунками привлекали ваше внимание, странная, еле заметная дверь обклеенная обоями была заперта.'];

  const AD_PHOTOS = ['https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'];

localStorage.clear();

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

const getRandomNumsArray = (count, maxNum = count) => {
  const newList = [];
  let newId = getRandomInteger(0, maxNum);

  while (newList.length < count) {
    if (newList.includes(newId)) {
      newId = getRandomInteger(0, maxNum);
    } else {
      newList.push(newId);
    }
  }

  return newList;
};

const createList = (source) => {
  const listLength = getRandomInteger(1, source.length);

  if (source.length < listLength) listLength = source.length;

  const itemsNums = getRandomNumsArray(listLength, source.length - 1);
  let newItemsList = [];
  for (let i = 0; i < listLength; i++) {
    newItemsList.push(source[itemsNums[i]]);
  }
  return newItemsList;
};

const getRandomFloatList = (min, max, decimals, count) => {
  let newFloatList = [];
  for (let i = 0; i < count; i++) {
    const newFloat = getRandomFloat(min, max, decimals);
    newFloatList.push(newFloat);
  }
  return newFloatList
}

const randomLats = getRandomFloatList(35.65000, 35.70000, 5, 10);
const randomLtds = getRandomFloatList(139.70000, 139.80000, 5, 10);

function Advertisment() {
  this.author = {
    avatar: `img/avatars/user${getRandomInteger(1, 10)}.png`
  },
  this.offer = {
    title: AD_TITLES[getRandomInteger(0, AD_TITLES.length - 1)],
    address: {
      lat: randomLats[getRandomInteger(0, randomLats.length - 1)],
      lng: randomLtds[getRandomInteger(0, randomLtds.length - 1)]
    },
    price: getRandomInteger(1000, 10000)
  },
  this.type = AD_TYPES[getRandomInteger(0, AD_TYPES.length - 1)],
  this.rooms = getRandomInteger(1, 5),
  this.guests = getRandomInteger(1, 5),
  this.checkin = AD_CHECKINS[getRandomInteger(0, AD_CHECKINS.length - 1)],
  this.checkout = AD_CHECKOUTS[getRandomInteger(0, AD_CHECKOUTS.length - 1)],
  this.features = createList(AD_FEATURES),
  this.description = AD_DESCRIPTION[getRandomInteger(0, AD_DESCRIPTION.length - 1)],
  this.photos = createList(AD_PHOTOS),
  this.location = {
    lat: randomLats[getRandomInteger(0, randomLats.length - 1)],
    lng: randomLtds[getRandomInteger(0, randomLtds.length - 1)]
  }
};

const createAdvertisments = () => {
  let newAdsList = [];
  for (let i = 0; i < AD_COUNT; i++) {
    const newAd = new Advertisment();
    newAdsList.push(newAd);
  }
  return newAdsList;
};

const advertismentsList = createAdvertisments();
console.log(advertismentsList);

