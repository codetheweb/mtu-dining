const fs = require('fs');
const {resolve, basename} = require('path');
const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const Papa = require('papaparse');

class Dining {
  constructor() {
    this.WADS = 'wads';
    this.MCNAIR = 'mcnair';

    this.baseURL = 'https://www.mtu.edu/dining/centers/';

    this.menu = {};
  }

  async load(hall) {
    if (!(hall === this.WADS || hall === this.MCNAIR)) {
      throw new TypeError('Wrong hall format.');
    }

    const dataDirectory = resolve('data/' + moment().year() + '/' + hall);

    if (fs.existsSync(dataDirectory)) {
      return this._staticLoad(dataDirectory);
    }
    return this._httpLoad(hall);
  }

  _staticLoad(directory) {
    let finalMenu = {};

    return new Promise((resolve, reject) => {
      fs.readdir(directory, (error, items) => {
        if (error) {
          reject(error);
        }

        this.forEachPromise(items, async filename => {
          const menu = await this._fileLoad(directory + '/' + filename);
          finalMenu = Object.assign({}, finalMenu, menu);
        }).then(() => {
          this.menu = finalMenu;

          resolve(this.menu);
        });
      });
    });
  }

  _fileLoad(path) {
    let startDate = basename(path);
    startDate = startDate.substr(0, startDate.lastIndexOf('.'));
    startDate = new moment(startDate, 'M:DD:YY');

    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        }

        const parsedData = Papa.parse(data).data;

        // Remove header
        parsedData.shift();

        // Shove into object
        const menu = {};

        for (let i = 0; i < 7; i++) {
          menu[startDate] = {
            breakfast: parsedData[0][i].split('\n'),
            lunch: parsedData[1][i].split('\n'),
            dinner: parsedData[2][i].split('\n')
          };

          // Increment startDate by 1 day
          startDate.add(1, 'days');
        }

        resolve(menu);
      });
    });
  }

  async _httpLoad(hall) {
    const response = await got(this.baseURL + hall);

    const $ = cheerio.load(response.body);

    const semesterMenu = {};

    // For each meal rotation
    $('#content_body > h2').each((index, header) => {
      const thisHeader = $(header).text();

      // Add all weeks to semester
      const re = /(\d+\/\d+)-(\d+\/\d+)/g;
      const theseWeeks = [];

      thisHeader.replace(re, (match, g1, _) => {
        const thisPair = g1.split('/');
        theseWeeks.push({
          month: parseInt(thisPair[0], 10),
          day: parseInt(thisPair[1], 10)
        });
      });

      // For each day in week
      const thisMealPlan = {};

      $('.sliders:nth-of-type(' + (index + 2) + ') table').each((dayOfWeek, table) => {
        const meals = {};

        // For each mealtime in day
        $(table).find('tr:nth-child(2) td').each((mealTime, menuDay) => {
          // For each item in meal
          const items = [];

          $(menuDay).text().split(/\r?\n/).forEach(s => {
            if (s.trim() !== '') {
              items.push(s.trim());
            }
          });

          // Add items to correct mealtime
          switch (mealTime) {
            case 0:
              meals.breakfast = items;
              break;
            case 1:
              meals.lunch = items;
              break;
            case 2:
              meals.dinner = items;
              break;
            default:
              break;
          }
        });

        thisMealPlan[dayOfWeek] = meals;
      });

      // At this point we know the
      // meal plan for the entire week
      // (in thisMealPlan) and the
      // weeks it will be served
      // (theseWeeks).
      theseWeeks.forEach(startDate => {
        const thisDay = new moment().set({
          month: startDate.month - 1,
          date: startDate.day,
          hour: 0,
          minute: 0,
          second: 0,
          milisecond: 0});

        // For every day in week
        for (let i = 0; i < 7; i++) {
          thisDay.day(i + 1);
          semesterMenu[thisDay] = thisMealPlan[i];
        }
      });
    });

    // Sort by date
    const orderedSemesterMenu = {};

    Object.keys(semesterMenu).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    }).forEach(key => {
      orderedSemesterMenu[key] = semesterMenu[key];
    });

    this.menu = orderedSemesterMenu;
    return this.menu;
  }

  get(date) {
    // Check arguments
    if (Object.keys(this.menu).length === undefined) {
      throw new Error('Menu not loaded yet.');
    }

    if (!date || Object.keys(this.menu).length === undefined) {
      date = {};
    }

    if (typeof date.day !== 'number' || typeof date.month !== 'number') {
      throw new TypeError('Must give day and month.');
    }

    const queryDate = new moment().set({
      month: date.month,
      date: date.day,
      hour: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    });

    return this.menu[queryDate];
  }

  forEachPromise(items, fn) {
    return items.reduce((promise, item) => {
      return promise.then(() => {
        return fn(item);
      });
    }, Promise.resolve());
  }
}

module.exports = Dining;
