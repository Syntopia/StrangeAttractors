// Created by Mikael Hvidtfeldt Christensen, (Twitter: @SyntopiaDK, web: hvidtfeldts.net).
// Released under Creative Commons Attribution License 3.0: https://creativecommons.org/licenses/by/3.0/


// ---------------------------------- Aizawa ----------------------------------

// Formula from here: http://www.algosome.com/articles/aizawa-attractor-chaos.html
// See also: https://www.behance.net/gallery/7618879/Strange-Attractors
function Aizawa() {
    this.a = 0.95;
    this.b = 0.7;
    this.e = 0.25;
    this.c = 0.6;
    this.d = 3.5;
    this.f = 0.1;
};

Aizawa.prototype = Object.assign(Aizawa.prototype, {
    constructor: Aizawa,

    getName() {
        return "Aizawa";
    },

    advance: function (p, t) {
        var dx = (p[2] - this.b) * p[0] - this.d * p[1];
        var dy = this.d * p[0] + (p[2] - this.b) * p[1];
        var dz = this.c + this.a * p[2] - (p[2] * p[2] * p[2] / 3) - (p[0] * p[0] + p[1] * p[1]) * (1 + this.e * p[2]) + this.f * p[2] * p[0] * p[0] * p[0];
        return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// ---------------------------- Rucklidge -------------------------------------------

// See: https://www.behance.net/gallery/7618879/Strange-Attractors
function Rucklidge() {
    this.kappa = 2;
    this.alpha = 6.7;

};

Rucklidge.prototype = Object.assign(Rucklidge.prototype, {
    constructor: Rucklidge,

    getName() {
        return "Rucklidge";
    },

    advance: function (p, t) {
        var dx = -this.kappa * p[0] + this.alpha * p[1] - p[1] * p[2];
        var dy = p[0];
        var dz = -p[2] + p[1] * p[1];
        return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});



/*
* See: http://www.algosome.com/articles/lorenz-attractor-programming-code.html
*/


// See: https://www.behance.net/gallery/7618879/Strange-Attractors
function Lorentz() {
    this.a = 10.0;
    this.b = 28.0;
    this.c = 8.0 / 3.0;
};

Lorentz.prototype = Object.assign(Lorentz.prototype, {
    constructor: Lorentz,

    getName() {
        return "Lorentz";
    },

    advance: function (p, t) {
        t = t/5.0;
        var dx = this.a * (p[1] - p[0]);
        var dy = p[0] * (this.b - p[2]) - p[1];
        var dz = p[0] * p[1] - this.c * p[2];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});


/**
 * Chen Lee
 */

function ChenLee() {
    this.a = 5;
    this.b = -10;
    this.c = -0.38;
};

ChenLee.prototype = Object.assign(ChenLee.prototype, {
    constructor: ChenLee,

    getName() {
        return "Chen Lee";
    },

    advance: function (p, t) {
        t = t/10.0;
        var dx = this.a * p[0] - p[1]*p[2];
        var dy = this.b * p[1] + p[0]*p[2];
        var dz = this.c * p[2] + p[0]*p[1];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

function getAttractors() {
    return [new Aizawa(), new ChenLee(), new Lorentz(), new Rucklidge()];
}