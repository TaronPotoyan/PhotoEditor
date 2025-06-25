"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyGenerator = keyGenerator;
function keyGenerator() {
    let key = 0;
    for (let i = 0; i < 6; ++i) {
        const digit = Math.floor(Math.random() * 9) + 1;
        key = key * 10 + digit;
    }
    return key;
}
