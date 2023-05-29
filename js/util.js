const ALERT_SHOW_TIME = 5000;

const alertContainer = document.querySelector('.alert-container');

const showAlert = (message) => {
  alertContainer.textContent = message;

  alertContainer.classList.remove('hidden');
  setTimeout(() => {
    alertContainer.classList.add('hidden');
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

const setInteractiveElementsAvailability =
  (selector, container = document, state = true) => {
    container.querySelectorAll(selector).forEach((element) => {
      element.disabled = state;
    });
  };

export { showAlert, isEscapeKey, debounce, setInteractiveElementsAvailability };
