
/*
    Grammar:

    S -> S and P | P
    P -> [statement]

*/

var Expressions = {};

Expressions.S = {
    regex: /^(.+) and (.+)$/,
    length: 2
};

Expressions.P = {
    'isa': {
            regex: /^(the )?([A-Za-z]+) is an? ([A-Za-z ]+)$/,
            length: 3
        },
    'isvar': {
            regex: /^([A-Za-z]+) is ([-.A-Za-z0-9]+)$/,
            length: 2
        },
    'isattr': {
            regex: /^([A-Za-z]+)('s)? ([A-Za-z]+) is ([-.A-Za-z0-9]+)$/,
            length: 4
        },
    'moveattr': {
            regex: /^move ([A-Za-z]+)('s)? ([A-Za-z]+) ([-.A-Za-z0-9]+)$/,
            length: 4
        },
    'remove': {
            regex: /^((remove)|(delete)) ([A-Za-z]+)$/,
            length: 4
        },
     'narrate': {
            regex: /^(the )?([A-Za-z]+) says? (.+)$/,
            length: 3
        },
};


var example = "billy is a person and billy says hi there!\nmove billy up 100\nmove billy's size 50 and billy says how's it going?\nbilly says this play is a program!\nbilly says press the menu button to see it! and move billy left 200";

//define colors for color picker
var colorArr = [
        {r: 82, g:46, b:26},
        {r: 109, g:78, b:40},
        {r: 211, g:174, b:136},
        {r: 236, g:204, b:165},
        {r: 250, g:227, b:198},

        {r: 250, g:94, b:121},
        {r: 251, g:147, b:147},
        {r: 251, g:196, b:172},
        {r: 255, g:225, b:184},
        {r: 255, g:215, b:139},


        {r: 207, g:240, b:158},
        {r: 168, g:219, b:168},
        {r: 121, g:189, b:154},
        {r: 59, g:134, b:134},
        {r: 11, g:72, b:107},

        {r: 236, g:208, b:120},
        {r: 217, g:91, b:67},
        {r: 192, g:41, b:66},
        {r: 84, g:36, b:55},
        {r: 83, g:119, b:122},

        {r: 202,g: 237,b: 105},
        {r: 242,g: 247,b: 229},
        {r: 133,g: 224,b: 242},
        {r: 54,g: 150,b: 169},
        {r: 45,g: 100,b: 111},

        {r: 245,g: 38,b: 87},
        {r: 255,g: 54,b: 87},
        {r: 245,g: 233,b: 201},
        {r: 220,g: 208,b: 175},
        {r: 48,g: 9,b: 15},
        {r: 72,g: 150,b: 192},

        {r: 72,g: 192,b: 110},
        {r: 227,g: 236,b: 75},
        {r: 238,g: 90,b: 146},
        {r: 211,g: 80,b: 197},
        {r: 239,g: 206,b: 28},
        {r: 239,g: 68,b: 28},
        {r: 228,g: 205,b: 144},
        {r: 206,g: 104,b: 64},
        {r: 180,g: 180,b: 180}
    ];



//define filter
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";
 
    if (this == null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
    return res;
  };
}
