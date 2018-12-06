import test from 'ava';

const MTUDining = require('.');

test('Load and query data for Wads', async t => {
  const Wads = new MTUDining();

  await Wads.load(Wads.WADS);

  const result = Wads.get({month: 9, day: 1});

  if (Object.keys(result).length === 0) {
    t.fail('Result of query was empty.');
  } else {
    t.pass();
  }
});

test('Load and query data for McNair', async t => {
  const McNair = new MTUDining();

  await McNair.load(McNair.MCNAIR);

  const result = McNair.get({month: 9, day: 1});

  if (Object.keys(result).length === 0) {
    t.fail('Result of query was empty.');
  } else {
    t.pass();
  }
});
