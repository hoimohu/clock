import { Clock } from "./modules/clock.js";
import { Stopwatch } from "./modules/stopwatch.js";
import { Timer } from "./modules/timer.js";

const main = document.getElementById('main');

const clock = new Clock(100);
const stopwatch = new Stopwatch();
const timer = new Timer();

function init() {
  document.body.appendChild(main);

  main.appendChild(clock.wrapper);

  const stopwatch_title = document.createElement('div');
  stopwatch_title.classList.add('label_title');
  stopwatch_title.textContent = 'ストップウォッチ';
  main.appendChild(stopwatch_title);
  main.appendChild(stopwatch.wrapper);

  const timer_title = document.createElement('div');
  timer_title.classList.add('label_title');
  timer_title.textContent = 'タイマー';
  main.appendChild(timer_title);
  main.appendChild(timer.wrapper);

  const marginBottom = document.createElement('div');
  marginBottom.classList.add('marginBottom');
  main.appendChild(marginBottom);
}

window.onload = init;