import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let intervalId = null;

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', onStartBtnClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      refs.startBtn.disabled = true;

      Notify.failure('Please choose a date in the future');
      return;
    }
    refs.startBtn.disabled = false;
  },
};

const datePicker = flatpickr(refs.dateInput, options);

function onStartBtnClick() {
  refs.startBtn.disabled = true;
  refs.dateInput.disabled = true;

  const diff = datePicker.selectedDates[0] - new Date();
  if (diff < 0) {
    clearInterval(intervalId);
    return;
  }

  refs.days.textContent = addLeadingZero(convertMs(diff).days);
  refs.hours.textContent = addLeadingZero(convertMs(diff).hours);
  refs.minutes.textContent = addLeadingZero(convertMs(diff).minutes);
  refs.seconds.textContent = addLeadingZero(convertMs(diff).seconds);

  intervalId = setInterval(onStartBtnClick, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}
