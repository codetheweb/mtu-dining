const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');

class Dining {
  constructor() {
    this.WADS = 'wads';
    this.MCNAIR = 'mcnair';

    this.baseURL = 'https://www.mtu.edu/dining/centers/';
  }

  async getMenu(hall) {
    const response = await got(this.baseURL + hall);

    const $ = cheerio.load(response.body);

    let semesterMenu = {};

    // For each meal rotation
    $('#content_body > h2').each((index, header) => {
      let thisHeader = $(header).text();

      // Add all weeks to semester
      let re = /(\d+\/\d+)-(\d+\/\d+)/g;
      let theseWeeks = [];

      thisHeader.replace(re, (match, g1, g2) => {
        const thisPair = g1.split('/');
        theseWeeks.push({
          month: parseInt(thisPair[0]),
          day: parseInt(thisPair[1])
        });
      });

      // For each day in week
      let thisMealPlan = {};

      $('.sliders:nth-of-type(' + (index + 2) + ') table').each((dayOfWeek, table) => {
        let meals = {};

        // For each mealtime in day
        $(table).find('tr:nth-child(2) td').each((mealTime, menuDay) => {
          // For each item in meal
          let items = [];

          $(menuDay).text().split(/\r?\n/).forEach(s => {
            if (s.trim() !== '')
              items.push(s.trim());
          });

          // Add items to correct mealtime
          switch(mealTime) {
            case 0:
              meals.breakfast = items;
              break;
            case 1:
              meals.lunch = items;
              break;
            case 2:
              meals.dinner = items;
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
        let thisDay = new moment().set({
          'month': startDate.month - 1,
          'date': startDate.day,
          'hour': 0,
          'minute': 0,
          'second': 0,
          'milisecond': 0});

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
    }).forEach((key) => {
      orderedSemesterMenu[key] = semesterMenu[key];
    });

    return orderedSemesterMenu;
  }
}

module.exports = Dining;
