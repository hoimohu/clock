export class Stopwatch {
  running = false;
  startTime = null;
  stopTime = 0;
  interval = -1;
  constructor(interval = -1, type) {
    this.interval = interval;
    this.createWrapper(type);
    const stopTime = localStorage.getItem('kunugisoft_stopwatch_stoptime');
    if (stopTime !== null) {
      this.stopTime = Number(stopTime);
    }
    const startTime = localStorage.getItem('kunugisoft_stopwatch_starttime');
    if (startTime !== null) {
      this.startTime = Number(startTime);
      this.start();
    }
    this.update();
  }

  start() {
    this.running = true;
    localStorage.removeItem('kunugisoft_stopwatch_stoptime');
    if (this.startTime === null) {
      this.startTime = Date.now();
      localStorage.setItem('kunugisoft_stopwatch_starttime', this.startTime);
    }
  }

  stop() {
    this.running = false;
    this.stopTime += Date.now() - this.startTime;
    this.startTime = null;
    localStorage.setItem('kunugisoft_stopwatch_stoptime', this.stopTime);
    localStorage.removeItem('kunugisoft_stopwatch_starttime');
  }

  reset() {
    this.running = true;
    this.startTime = null;
    this.stopTime = 0;
    localStorage.removeItem('kunugisoft_stopwatch_stoptime');
    localStorage.removeItem('kunugisoft_stopwatch_starttime');
  }

  update() {
    let time = this.stopTime + ((this.startTime !== null) ? Date.now() - this.startTime : 0);

    time = Math.round(time / 10);
    const under_second = time % 100;
    this.under_second1.textContent = (under_second / 10 >= 1) ? Math.floor(under_second / 10) : '0';
    this.under_second2.textContent = Math.floor(under_second % 10);
    time = Math.floor(time / 100);
    const second = time % 60;
    this.second1.textContent = (second / 10 >= 1) ? Math.floor(second / 10) : '0';
    this.second2.textContent = second % 10;
    time = Math.floor(time / 60);
    const minute = time % 60;
    this.minute1.textContent = (minute / 10 >= 1) ? Math.floor(minute / 10) : '0';
    this.minute2.textContent = minute % 10;
    time = Math.floor(time / 60);
    const hour = time % 60;
    this.hour1.textContent = (hour / 10 >= 1) ? Math.floor(hour / 10) : '0';
    this.hour2.textContent = hour % 10;

    if (this.interval < 0) {
      requestAnimationFrame(() => this.update());
    } else {
      setTimeout(() => this.update(), this.interval);
    }
  }

  createWrapper(type = 'normal') {
    const wrapper = document.createElement('div');
    wrapper.classList.add('clock_type_' + type);

    const num_wrapper = document.createElement('div');
    num_wrapper.classList.add('clock_num_wrapper');

    const hour_wrapper = document.createElement('div');
    hour_wrapper.classList.add('clock_num_wrapper', 'clock_num_hour');
    const hour1 = document.createElement('span');
    const hour2 = document.createElement('span');
    hour_wrapper.appendChild(hour1);
    hour_wrapper.appendChild(hour2);

    const colon1 = document.createElement('div');
    colon1.classList.add('clock_colon');

    const minute_wrapper = document.createElement('div');
    minute_wrapper.classList.add('clock_num_wrapper', 'clock_num_minute');
    const minute1 = document.createElement('span');
    const minute2 = document.createElement('span');
    minute_wrapper.appendChild(minute1);
    minute_wrapper.appendChild(minute2);

    const colon2 = document.createElement('div');
    colon2.classList.add('clock_colon');

    const second_wrapper = document.createElement('div');
    second_wrapper.classList.add('clock_num_wrapper', 'stopwatch_num_second');
    const second1 = document.createElement('span');
    const second2 = document.createElement('span');
    second_wrapper.appendChild(second1);
    second_wrapper.appendChild(second2);

    const under_second_wrapper = document.createElement('div');
    under_second_wrapper.classList.add('clock_num_wrapper', 'stopwatch_num_under_second');
    const under_second1 = document.createElement('span');
    const under_second2 = document.createElement('span');
    under_second_wrapper.appendChild(under_second1);
    under_second_wrapper.appendChild(under_second2);

    num_wrapper.appendChild(hour_wrapper);
    num_wrapper.appendChild(colon1);
    num_wrapper.appendChild(minute_wrapper);
    num_wrapper.appendChild(colon2);
    num_wrapper.appendChild(second_wrapper);
    num_wrapper.appendChild(under_second_wrapper);


    const button_wrapper = document.createElement('div');
    button_wrapper.classList.add('stopwatch_button_wrapper');

    const start_button = document.createElement('button');
    start_button.textContent = 'スタート';
    start_button.addEventListener('click', () => this.start());
    const stop_button = document.createElement('button');
    stop_button.textContent = 'ストップ';
    stop_button.addEventListener('click', () => this.stop());
    const reset_button = document.createElement('button');
    reset_button.textContent = 'リセット';
    reset_button.addEventListener('click', () => this.reset());

    button_wrapper.appendChild(start_button);
    button_wrapper.appendChild(stop_button);
    button_wrapper.appendChild(reset_button);

    wrapper.appendChild(num_wrapper);
    wrapper.appendChild(button_wrapper);

    this.wrapper = wrapper;
    this.hour1 = hour1;
    this.hour2 = hour2;
    this.minute1 = minute1;
    this.minute2 = minute2;
    this.second1 = second1;
    this.second2 = second2;
    this.under_second1 = under_second1;
    this.under_second2 = under_second2;
  }
}