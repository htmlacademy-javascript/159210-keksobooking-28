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

export {getRandomInteger, getRandomNumsArray, getRandomFloat, getRandomFloatList, createList};
