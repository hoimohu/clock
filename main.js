import { Clock } from "./modules/clock.js";
import { Stopwatch } from "./modules/stopwatch.js";

const main = document.getElementById('main');

const clock = new Clock(100);
const stopwatch = new Stopwatch();

function init() {
  document.body.appendChild(main);

  main.appendChild(clock.wrapper);

  const stopwatch_title = document.createElement('div');
  stopwatch_title.classList.add('label_title');
  stopwatch_title.textContent = 'ストップウォッチ';
  main.appendChild(stopwatch_title);

  main.appendChild(stopwatch.wrapper);
}

window.onload = init;