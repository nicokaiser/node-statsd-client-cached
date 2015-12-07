'use strict';

var util = require('util');
var StatsDClient = require('statsd-client');

function Client(options) {
    this._flushInterval = options.flushInterval || 10000;

    this._deltas = {};
    this._gauges = {};
    this._sets = {};
    this._timeout = null;

    Client.super_.apply(this, arguments);
}

Client.prototype.counter = function (name, delta) {
    if (!this._deltas[name]) {
        this._deltas[name] = delta;
    } else {
        this._deltas[name] += delta;
    }
    this._startTimeout();
};

Client.prototype.set = function (name, value) {
    this._sets[name] = value;
    this._startTimeout();
};

Client.prototype.gauge = function (name, value) {
    this._gauges[name] = value;
    this._startTimeout();
};

Client.prototype.gaugeDelta = function (name, delta) {
    if (!this._gauges[name]) {
        this._gauges[name] = delta;
    } else {
        this._gauges[name] += delta;
    }
    this._startTimeout();
};

Client.prototype._startTimeout = function () {
    var self = this;
    if (!this._timeout) {
        this._timeout = setTimeout(function () {
            self._flush();
        }, this._flushInterval);
    }
};

Client.prototype._flush = function () {
    var name;

    if (this._timeout) clearTimeout(this._timeout);
    this._timeout = null;

    for (name in this._deltas) {
        Client.super_.prototype.counter.apply(this, [name, this._deltas[name]]);
    }

    for (name in this._sets) {
        Client.super_.prototype.set.apply(this, [name, this._sets[name]]);
    }

    for (name in this._gauges) {
        Client.super_.prototype.gauge.apply(this, [name, this._gauges[name]]);
    }

    this._deltas = {};
    this._sets = {};
    this._gauges = {};
};

util.inherits(Client, StatsDClient);

module.exports = Client;
