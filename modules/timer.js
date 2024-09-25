let nodeArray = [];
const actx = new AudioContext();
let timer_sound_source = null;
fetch('timer.mp3')
  .then(r => r.arrayBuffer())
  .then(b => actx.decodeAudioData(b))
  .then(da => { timer_sound_source = da; });
function playTimerSound() {
  if (timer_sound_source !== null) {
    let node = new AudioBufferSourceNode(actx, { buffer: timer_sound_source });
    node.connect(actx.destination);
    node.start();
    node.addEventListener('ended', () => {
      node.stop();
      node.disconnect();
      node = null;
      nodeArray.filter(e => e !== node);
    });
    nodeArray.push(node);
  }
}

function toTime(hour = 0, minute = 0, second = 0) {
  let time = hour;
  time *= 60;
  time += minute;
  time *= 60;
  time += second;
  time *= 1000;
  return time;
}

export class Timer {
  running = false;
  startTime = null;
  stopTime = 0;
  timerTime = 600000;
  interval = -1;
  soundCount = 0;
  timerchange_wrapper = null;
  constructor(interval = -1, type) {
    this.interval = interval;
    this.createWrapper(type);
    const timerTime = localStorage.getItem('kunugisoft_timer_timertime');
    if (timerTime !== null) {
      this.timerTime = Number(timerTime);
    }
    const stopTime = localStorage.getItem('kunugisoft_timer_stoptime');
    if (stopTime !== null) {
      this.stopTime = Number(stopTime);
    }
    const startTime = localStorage.getItem('kunugisoft_timer_starttime');
    if (startTime !== null) {
      this.startTime = Number(startTime);
      this.start();
    }
    this.update();
  }

  start() {
    this.running = true;
    if (this.timerchange_wrapper !== null) {
      this.timerTime = toTime(Math.max(0, Number(this.hour_input.value)), Math.max(0, Number(this.minute_input.value)), Math.max(0, Number(this.second_input.value)));
      localStorage.setItem('kunugisoft_timer_timertime', this.timerTime);
      this.removeChangeWrapper();
    }
    localStorage.removeItem('kunugisoft_timer_stoptime');
    if (this.startTime === null) {
      this.startTime = Date.now();
      localStorage.setItem('kunugisoft_timer_starttime', this.startTime);
    }
  }

  stop() {
    if (this.startTime !== null) {
      this.running = false;
      this.stopTime += Date.now() - this.startTime;
      this.startTime = null;
      localStorage.setItem('kunugisoft_timer_stoptime', this.stopTime);
      localStorage.removeItem('kunugisoft_timer_starttime');

      const elapsed_time = this.stopTime + ((this.startTime !== null) ? Date.now() - this.startTime : 0);
      let remaining_time = this.timerTime - elapsed_time;
      if (remaining_time <= 0) this.reset();
    }
  }

  reset() {
    this.running = false;
    this.startTime = null;
    this.stopTime = 0;
    localStorage.removeItem('kunugisoft_timer_stoptime');
    localStorage.removeItem('kunugisoft_timer_starttime');

    if (this.timerchange_wrapper === null) {
      const timerchange_wrapper = document.createElement('div');
      timerchange_wrapper.classList.add('timer_change_wrapper');

      let prevTime = this.timerTime;
      prevTime = Math.floor(prevTime / 1000);
      const second = prevTime % 60;
      prevTime = Math.floor(prevTime / 60);
      const minute = prevTime % 60;
      prevTime = Math.floor(prevTime / 60);
      const hour = prevTime % 60;

      const hour_label = document.createElement('label');
      const hour_input = document.createElement('input');
      hour_input.type = 'number';
      hour_input.min = 0;
      hour_input.step = 1;
      hour_input.value = hour;
      hour_label.appendChild(hour_input);
      const hour_text = document.createTextNode('時間');
      hour_label.appendChild(hour_text);
      timerchange_wrapper.appendChild(hour_label);
      const minute_label = document.createElement('label');
      const minute_input = document.createElement('input');
      minute_input.type = 'number';
      minute_input.max = 59;
      minute_input.min = 0;
      minute_input.step = 1;
      minute_input.value = minute;
      minute_label.appendChild(minute_input);
      const minute_text = document.createTextNode('分');
      minute_label.appendChild(minute_text);
      timerchange_wrapper.appendChild(minute_label);
      const second_label = document.createElement('label');
      const second_input = document.createElement('input');
      second_input.type = 'number';
      second_input.max = 59;
      second_input.min = 0;
      second_input.step = 1;
      second_input.value = second;
      second_label.appendChild(second_input);
      const second_text = document.createTextNode('秒');
      second_label.appendChild(second_text);
      timerchange_wrapper.appendChild(second_label);

      this.wrapper.appendChild(timerchange_wrapper);

      this.timerchange_wrapper = timerchange_wrapper;
      this.hour_input = hour_input;
      this.minute_input = minute_input;
      this.second_input = second_input;
    }
  }

  removeChangeWrapper() {
    this.timerchange_wrapper.remove();
    this.timerchange_wrapper = null;
    this.hour_input = null;
    this.minute_input = null;
    this.second_input = null;
  }

  update() {
    const elapsed_time = this.stopTime + ((this.startTime !== null) ? Date.now() - this.startTime : 0);
    let remaining_time = this.timerTime - elapsed_time;

    if (remaining_time <= 0 && this.startTime !== null) {
      this.soundCount++;
      if (this.soundCount >= 60) {
        playTimerSound();
        this.soundCount = 0;
      }
      remaining_time = 0;
      this.wrapper.classList.add('stopwatch_time_over');
    } else {
      this.wrapper.classList.remove('stopwatch_time_over');
    }

    remaining_time = Math.floor(remaining_time / 1000 + 0.99);
    const second = remaining_time % 60;
    this.second1.textContent = (second / 10 >= 1) ? Math.floor(second / 10) : '0';
    this.second2.textContent = second % 10;
    remaining_time = Math.floor(remaining_time / 60);
    const minute = remaining_time % 60;
    this.minute1.textContent = (minute / 10 >= 1) ? Math.floor(minute / 10) : '0';
    this.minute2.textContent = minute % 10;
    remaining_time = Math.floor(remaining_time / 60);
    const hour = remaining_time % 60;
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
    second_wrapper.classList.add('clock_num_wrapper', 'timer_num_second');
    const second1 = document.createElement('span');
    const second2 = document.createElement('span');
    second_wrapper.appendChild(second1);
    second_wrapper.appendChild(second2);

    num_wrapper.appendChild(hour_wrapper);
    num_wrapper.appendChild(colon1);
    num_wrapper.appendChild(minute_wrapper);
    num_wrapper.appendChild(colon2);
    num_wrapper.appendChild(second_wrapper);


    const button_wrapper = document.createElement('div');
    button_wrapper.classList.add('timer_button_wrapper');

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
  }
}