const ALERT_SHOW_TIME = 5000;

const DEFAULT_RADIX = 10;

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
  let listLength = getRandomInteger(1, source.length);

  if (source.length < listLength) {
    listLength = source.length;
  }

  const itemsNums = getRandomNumsArray(listLength, source.length - 1);
  const newItemsList = [];
  for (let i = 0; i < listLength; i++) {
    newItemsList.push(source[itemsNums[i]]);
  }
  return newItemsList;
};

const getRandomFloatList = (min, max, decimals, count) => {
  const newFloatList = [];
  for (let i = 0; i < count; i++) {
    const newFloat = getRandomFloat(min, max, decimals);
    newFloatList.push(newFloat);
  }
  return newFloatList;
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

function debounce(callback, timeoutDelay = 100) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

function throttle(callback, delayBetweenFrames) {
  let lastTime = 0;

  return (...rest) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback.apply(this, rest);
      lastTime = now;
    }
  };
}

export {getRandomInteger, getRandomNumsArray, getRandomFloat, getRandomFloatList,
  createList, showAlert, isEscapeKey, debounce, throttle, DEFAULT_RADIX};
