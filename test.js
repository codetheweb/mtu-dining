import test from 'ava';

const Moment = require('moment');

const MTUDining = require('.');

test('Load and query data for Wads', async t => {
  const Wads = new MTUDining();

  await Wads.load(Wads.WADS);

  // Hacky? Yes. Does it work? Yes.
  const result = Wads.get({month: Moment().month(), day: Moment().date()});

  if (Object.keys(result).length === 0) {
    t.fail('Result of query was empty.');
  } else {
    t.pass();
  }
});

test('Load and query data for McNair', async t => {
  const McNair = new MTUDining();

  await McNair.load(McNair.MCNAIR);

  // Hacky? Yes. Does it work? Yes.
  const result = McNair.get({month: Moment().month(), day: Moment().date()});

  if (Object.keys(result).length === 0) {
    t.fail('Result of query was empty.');
  } else {
    t.pass();
  }
});
