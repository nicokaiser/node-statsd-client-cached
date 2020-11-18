'use strict'

const StatsDClient = require('statsd-client')

class Client extends StatsDClient {
  constructor (options) {
    super(options)

    this._flushInterval = options.flushInterval || 10000

    this._deltas = {}
    this._gauges = {}
    this._sets = {}
    this._timings = []
    this._timeout = null
  }

  counter (name, delta) {
    if (!this._deltas[name]) {
      this._deltas[name] = delta
    } else {
      this._deltas[name] += delta
    }
    this._startTimeout()
  }

  timing (name, time) {
    const t = time instanceof Date ? new Date() - time : time
    this._timings.push([name, t])
    this._startTimeout()
  }

  set (name, value) {
    this._sets[name] = value
    this._startTimeout()
  }

  gauge (name, value) {
    this._gauges[name] = value
    this._startTimeout()
  }

  gaugeDelta (name, delta) {
    if (!this._gauges[name]) {
      this._gauges[name] = delta
    } else {
      this._gauges[name] += delta
    }
    this._startTimeout()
  }

  _startTimeout () {
    if (!this._timeout) {
      this._timeout = setTimeout(() => this._flush(), this._flushInterval)
    }
  }

  _flush () {
    let name

    if (this._timeout) clearTimeout(this._timeout)
    this._timeout = null

    for (name in this._deltas) {
      StatsDClient.prototype.counter.apply(this, [name, this._deltas[name]])
    }

    for (name in this._sets) {
      StatsDClient.prototype.set.apply(this, [name, this._sets[name]])
    }

    for (name in this._gauges) {
      StatsDClient.prototype.gauge.apply(this, [name, this._gauges[name]])
    }

    this._timings.forEach((timing) => {
      StatsDClient.prototype.timing.apply(this, [timing[0], timing[1]])
    })

    this._deltas = {}
    this._sets = {}
    this._gauges = {}
    this._timings = []
  }
}

module.exports = Client
