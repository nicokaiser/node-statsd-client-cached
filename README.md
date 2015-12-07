statsd-client-cached
====================

This is a wrapper for [statsd-client](https://github.com/msiebuhr/node-statsd-client), which aggregates values and changes for a specific interval and sends them to statsd only (at most) once every interval.

Usage
-----

It is initialized and used exaclty like `statsd-client`, with an additional `flushInterval` option (default: 10).

```javascript
var SDC = require('statsd-client-cached');

var sdc = new SDC({
    host: 'statsd.example.com',
    port: 8124,
    flushInterval: 10000 // default: 10 seconds
});
```

Notes
-----

Aggragation and delaying affects increments/decrements (counters) and gauges. Timers and histograms are sent immediately (as there is no aggregation for these).

License
-------

MIT
