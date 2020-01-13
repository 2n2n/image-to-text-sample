const functions = require('firebase-functions');
const express = require('express');
const mathsteps = require('mathsteps');
const app = express();
app.get('/scan', (request, response) => {
    let equation = request.query.text;
    if (equation == '') {
        response.send([]);
    }
    const steps = mathsteps.solveEquation(equation);
    response.send(steps);
});
exports.app = functions.https.onRequest(app);
