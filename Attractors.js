// Created by Mikael Hvidtfeldt Christensen, (Twitter: @SyntopiaDK, web: hvidtfeldts.net).
/*
MIT License

Copyright (c) 2018 Mikael Hvidtfeldt Christensen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// ----------------------------------------------------------------------------

/*
Formulas found in:
http://www.algosome.com/articles/aizawa-attractor-chaos.html
https://www.behance.net/gallery/7618879/Strange-Attractors
*/


// ---------------------------------- Aizawa ----------------------------------

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

    getName: function() {
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


function Rucklidge() {
    this.kappa = 2;
    this.alpha = 6.7;

};

Rucklidge.prototype = Object.assign(Rucklidge.prototype, {
    constructor: Rucklidge,

    getName: function() {
        return "Rucklidge";
    },

    advance: function (p, t) {
        var dx = -this.kappa * p[0] + this.alpha * p[1] - p[1] * p[2];
        var dy = p[0];
        var dz = -p[2] + p[1] * p[1];
        return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// ---------------------------- Lorentz -------------------------------------------


function Lorentz() {
    this.a = 10.0;
    this.b = 28.0;
    this.c = 8.0 / 3.0;
};

Lorentz.prototype = Object.assign(Lorentz.prototype, {
    constructor: Lorentz,

    getName: function() {
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


// ---------------------------- Chen Lee -------------------------------------------

function ChenLee() {
    this.a = 5;
    this.b = -10;
    this.c = -0.38;
};

ChenLee.prototype = Object.assign(ChenLee.prototype, {
    constructor: ChenLee,

    getName: function() {
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

// -----------------------------------------------------------------------

function Arneodo() {
    this.a = -6.0;
    this.b = 4.3;
    this.c = -2;
};

Arneodo.prototype = Object.assign(Arneodo.prototype, {
    constructor: Arneodo,

    getName: function() {
        return "Arneodo";
    },

    advance: function (p, t) {
        var dx =  p[1];
        var dy = p[2];
        var dz = -this.a * p[0] - this.b * p[1] - p[2] + this.c * p[0]*p[0]*p[0] ;
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// https://matousstieber.wordpress.com/2016/01/11/lorenz-attractor/
// http://www.3d-meier.de/tut19/plugins/Bouali.cof
function Bouali() {
    this.a = 4;
    this.b = 1;
    this.alfa = 0.3;
    this.beta = 0.05;
    this.c = 1.5;
    this.s = 1;
};

Bouali.prototype = Object.assign(Bouali.prototype, {
    constructor: Bouali,

    getName: function() {
        return "Bouali";
    },

    advance: function (p, t) {
        var dx =  p[0]*(this.a-p[1])+this.alfa*p[2];
        var dy = -p[1]*(this.b-p[0]*p[0]);
        var dz = -p[0]*(this.c-this.s*p[2]) - this.beta*p[2] ;
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite9.html

function DequanLi() {
    this.a = 40;
    this.b = 1.833;
    this.d = 0.16;
    this.e = 0.65;
    this.p = 55;
    this.g = 20;
};

DequanLi.prototype = Object.assign(DequanLi.prototype, {
    constructor: DequanLi,

    getName: function() {
        return "Dequan Li";
    },

    advance: function (p, t) {
        t = t/ 10;
        var dx =  this.a*(p[1]-p[0])+this.d*(p[0]*p[2]);
        var dy = this.p*p[0]+this.g*p[1]- p[0]*p[2];
        var dz = this.b*p[2]+ p[0]*p[1] - this.e*p[0]*p[0] ;
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://www.3d-meier.de/tut19/plugins/Liu-Chen.cof

function LiuChen() {
    this.a = 2.4;
    this.b = -3.78;
    this.c = 14;
    this.d = -11;
    this.e = 4.0;
    this.f = 5.58;
    this.g =-1;
};

LiuChen.prototype = Object.assign(LiuChen.prototype, {
    constructor: LiuChen,

    getName: function() {
        return "Liu Chen";
    },

    advance: function (p, t) {
        t = t/ 10;
        var dx =  this.a*p[1]+this.b*p[0]+this.c*p[1]*p[2];
        var dy = this.d * p[1] - p[2] + this.e*p[0]*p[2];
        var dz = this.f*p[2]+this.g*p[0]*p[1] ;
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite15.html

function NoseHoover() {
    this.a = 0.750;
};

NoseHoover.prototype = Object.assign(NoseHoover.prototype, {
    constructor: NoseHoover,

    getName: function() {
        return "Nose-Hoover";
    },

    advance: function (p, t) {
        t = t /5;
        var dx = p[1];
        var dy = -p[0] + p[1]*p[2];
        var dz = this.a - p[1]*p[1] ;
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite13.html

function Halvorsen () {
    this.a = 1.4;
};

Halvorsen .prototype = Object.assign(Halvorsen .prototype, {
    constructor: Halvorsen ,

    getName: function() {
        return "Halvorsen";
    },

    advance: function (p, t) {
        t = t /5;
        var dx = -this.a*p[0] - 4*p[1] - 4*p[2] - p[1]*p[1];
        var dy = -this.a*p[1] - 4*p[2] - 4*p[0] - p[2]*p[2];
        var dz = -this.a*p[2] - 4*p[0] - 4*p[1] - p[0]*p[0];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});


// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite13.html

function Hadley () {
    this.a = 0.2;
    this.b = 4.0;
    this.f = 8.0;
    this.g = 1.0;
};

Hadley.prototype = Object.assign(Hadley .prototype, {
    constructor: Hadley ,

    getName: function() {
        return "Hadley";
    },

    advance: function (p, t) {
        t = t/2;
      var dx = -p[1]*p[1] - p[2]*p[2] - this.a*p[0] + this.a*this.f;
        var dy = p[0]*p[1] - this.b*p[0]*p[2] - p[1] + this.g;
        var dz = this.b*p[0]*p[1] + p[0]*p[2] - p[2];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite43.html

function TSUCS2 () {
    this.a = 40;
    this.b = 55;
    this.c = 1.833;
    this.d = 0.16;
    this.e = 0.65;
    this.f = 20;
};

TSUCS2.prototype = Object.assign(TSUCS2 .prototype, {
    constructor: TSUCS2 ,

    getName: function() {
        return "TSUCS2";
    },

    advance: function (p, t) {
        t = t/10;
       var dx = this.a*(p[1]-p[0]) + this.d*p[0]*p[2];
        var dy = this.b*p[0]*p[0] - p[0]*p[2] + this.f*p[1];
        var dz = this.c*p[2] + p[0]*p[1] - this.e*p[0]*p[0];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// https://en.wikipedia.org/wiki/R%C3%B6ssler_attractor

function Rossler() {
    this.a=0.2;
    this.b=0.2;
    this.c=5.7;
};

Rossler.prototype = Object.assign(Rossler .prototype, {
    constructor: Rossler ,

    getName: function() {
        return "Rössler";
    },

    advance: function (p, t) {
        t = t/10.1;
       var dx = -p[1]-p[2];
        var dy = p[0]+this.a*p[1];
        var dz = this.b + p[2]*(p[0]-this.c);
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

// -----------------------------------------------------------------------
// http://3d-meier.de/tut19/Seite43.html

function TSUCS1 () {
    this.a=40.0;
    this.c=0.833;
    this.d=0.5;
    this.e=0.65;
    this.f=20.0;
};

TSUCS1.prototype = Object.assign(TSUCS1 .prototype, {
    constructor: TSUCS1 ,

    getName: function() {
        return "TSUCS1";
    },

    advance: function (p, t) {
        t = t/100.1;
       var dx = this.a*(p[1]-p[0]) + this.d*p[0]*p[2];
        var dy = this.f*p[1] - p[0]*p[2];
        var dz = this.c*p[2] + p[0]*p[1] - this.e*p[0]*p[0];
         return [p[0] + dx * t, p[1] + dy * t, p[2] + dz * t];
    },
});

function getAttractors() {
    return [new Aizawa(), new ChenLee(), new Lorentz(), new Rucklidge(),
         new Arneodo(), new Bouali(), /*new DequanLi(), */new LiuChen(), new NoseHoover(),
        new Halvorsen(), new Hadley(), new TSUCS1(), new Rossler()
        ];
}