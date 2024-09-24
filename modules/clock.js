const days = ['日', '月', '火', '水', '木', '金', '土'];

export class Clock {
  interval = -1;
  constructor(interval = -1, type) {
    this.interval = interval;
    this.createWrapper(type);
    this.update();
  }

  update() {
    const nowDate = new Date();

    const year = nowDate.getFullYear();
    this.year1.textContent = year + '年';
    const month = nowDate.getMonth();
    this.month1.textContent = month + 1 + '月';
    const date = nowDate.getDate();
    this.date1.textContent = date + '日';
    const day = nowDate.getDay();
    this.day1.textContent = '(' + days[day] + ')';

    const hour = nowDate.getHours();
    this.hour1.textContent = (hour / 10 >= 1) ? Math.floor(hour / 10) : ' ';
    this.hour2.textContent = hour % 10;
    const minute = nowDate.getMinutes();
    this.minute1.textContent = (minute / 10 >= 1) ? Math.floor(minute / 10) : '0';
    this.minute2.textContent = minute % 10;
    const second = nowDate.getSeconds();
    this.second1.textContent = (second / 10 >= 1) ? Math.floor(second / 10) : '0';
    this.second2.textContent = second % 10;

    if (this.interval < 0) {
      requestAnimationFrame(() => this.update());
    } else {
      setTimeout(() => this.update(), this.interval);
    }
  }

  createWrapper(type = 'normal') {
    const wrapper = document.createElement('div');
    wrapper.classList.add('clock_type_' + type);


    const num_wrapper1 = document.createElement('div');
    num_wrapper1.classList.add('clock_num_wrapper_top');

    const year_wrapper = document.createElement('div');
    year_wrapper.classList.add('clock_num_wrapper_top', 'clock_num_year');
    const year1 = document.createElement('span');
    year_wrapper.appendChild(year1);

    const month_wrapper = document.createElement('div');
    month_wrapper.classList.add('clock_num_wrapper_top', 'clock_num_month');
    const month1 = document.createElement('span');
    month_wrapper.appendChild(month1);

    const date_wrapper = document.createElement('div');
    date_wrapper.classList.add('clock_num_wrapper_top', 'clock_num_date');
    const date1 = document.createElement('span');
    date_wrapper.appendChild(date1);

    const day_wrapper = document.createElement('div');
    day_wrapper.classList.add('clock_num_wrapper_top', 'clock_num_day');
    const day1 = document.createElement('span');
    day_wrapper.appendChild(day1);

    num_wrapper1.appendChild(year_wrapper);
    num_wrapper1.appendChild(month_wrapper);
    num_wrapper1.appendChild(date_wrapper);
    num_wrapper1.appendChild(day_wrapper);
    wrapper.appendChild(num_wrapper1);


    const num_wrapper2 = document.createElement('div');
    num_wrapper2.classList.add('clock_num_wrapper');

    const hour_wrapper = document.createElement('div');
    hour_wrapper.classList.add('clock_num_wrapper', 'clock_num_hour');
    const hour1 = document.createElement('span');
    const hour2 = document.createElement('span');
    hour_wrapper.appendChild(hour1);
    hour_wrapper.appendChild(hour2);

    const colon = document.createElement('div');
    colon.classList.add('clock_colon');

    const minute_wrapper = document.createElement('div');
    minute_wrapper.classList.add('clock_num_wrapper', 'clock_num_minute');
    const minute1 = document.createElement('span');
    const minute2 = document.createElement('span');
    minute_wrapper.appendChild(minute1);
    minute_wrapper.appendChild(minute2);

    const second_wrapper = document.createElement('div');
    second_wrapper.classList.add('clock_num_wrapper', 'clock_num_second');
    const second1 = document.createElement('span');
    const second2 = document.createElement('span');
    second_wrapper.appendChild(second1);
    second_wrapper.appendChild(second2);

    num_wrapper2.appendChild(hour_wrapper);
    num_wrapper2.appendChild(colon);
    num_wrapper2.appendChild(minute_wrapper);
    num_wrapper2.appendChild(second_wrapper);
    wrapper.appendChild(num_wrapper2);

    this.wrapper = wrapper;
    this.year1 = year1;
    this.month1 = month1;
    this.date1 = date1;
    this.day1 = day1;
    this.hour1 = hour1;
    this.hour2 = hour2;
    this.minute1 = minute1;
    this.minute2 = minute2;
    this.second1 = second1;
    this.second2 = second2;
  }
}