🌭 MTU-Dinning 🌮
==================

A package to scrape all those tasty meals (😋) from Michigan Tech's published meal schedule for the dining halls.

## Usage

```javascript
const MTUDinning = require('mtu-dinning');

const Dinning = new MTUDinning();

(async() => {
  console.log(await Dinning.getMenu(Dinning.MCNAIR));
})();
```

## Documentation

Dead simple, just like the meals.  One function:

- `getMenu(hall)`, where `hall` is `(new MTUDinning()).MCNAIR || (new MTUDinning()).WADS`.


Enjoy your food.
