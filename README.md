🌭 MTU-Dining 🌮  [![Build Status](https://travis-ci.com/codetheweb/mtu-dining.svg?branch=master)](https://travis-ci.com/codetheweb/mtu-dining)
==================

A package to scrape all those tasty meals (😋) from Michigan Tech's published meal schedule for the dining halls.

## Usage

```javascript
const MTUDining = require('mtu-dining');

const McNair = new MTUDining();

(async() => {
  await McNair.load(McNair.MCNAIR);

  console.log(McNair.get({month: 7, day: 27}))
})();
```

## Documentation

Dead simple, just like the meals.  Two functions:

- `load(hall)`, where `hall` is `(new MTUDining()).MCNAIR || (new MTUDining()).WADS`.
- `get(date)`, where `date` is `{month: _month_, day: _day_}`.

Enjoy your food.
