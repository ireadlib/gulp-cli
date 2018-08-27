"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.circleArea = circleArea;
exports.rectArea = rectArea;

// tools


function circleArea(r) {
    return Math.PI * r * r;
}

function rectArea(w, h) {
    return w * h;
}