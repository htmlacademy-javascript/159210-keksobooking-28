const BASE_URL = 'https://28.javascript.pages.academy/keksobooking';
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/'
};
const Method = {
  GET: 'GET',
  POST: 'POST'
};

const GET_DATA_ERROR_MESSAGE = 'Не удалось загрузить данные. Попробуйте обновить страницу';

const load = (route, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}`, { method, body });

const getData = () =>
  load(Route.GET_DATA)
    .then((response) => response.json());

const sendData = (body, onSuccess, onError) =>
  load(Route.SEND_DATA, Method.POST, body)
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch(onError);

export { getData, sendData, GET_DATA_ERROR_MESSAGE };
