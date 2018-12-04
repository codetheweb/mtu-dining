🌭 MTU-Dining 🌮
==================

A package to scrape all those tasty meals (😋) from Michigan Tech's published meal schedule for the dining halls.

## Usage

```javascript
const MTUDining = require('mtu-dining');

const Dining = new MTUDining();

(async() => {
  console.log(await Dining.getMenu(Dining.MCNAIR));
})();
```

## Documentation

Dead simple, just like the meals.  One function:

- `getMenu(hall)`, where `hall` is `(new MTUDining()).MCNAIR || (new MTUDining()).WADS`.


Enjoy your food.
