statsd-client-cached
====================

[![NPM version](https://badge.fury.io/js/statsd-client-cached.svg)](https://www.npmjs.com/package/statsd-client-cached)
[![Dependencies](https://img.shields.io/david/nicokaiser/node-statsd-client-cached.svg)](https://david-dm.org/nicokaiser/node-statsd-client-cached)

This is a wrapper for [statsd-client](https://github.com/msiebuhr/node-statsd-client), which aggregates values and changes for a specific interval and sends them to statsd only (at most) once every interval.

Usage
-----

It is initialized and used exaclty like `statsd-client`, with an additional `flushInterval` option (default: 10).

```javascript
const SDC = require('statsd-client-cached')

const sdc = new SDC({
  host: 'statsd.example.com',
  port: 8124,
  flushInterval: 10000 // default: 10 seconds
})
```

Notes
-----

Aggragation and delaying affects increments/decrements (counters) and gauges. Timers and histograms are sent immediately (as there is no aggregation for these).

License
-------

MIT
