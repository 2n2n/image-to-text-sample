const functions = require('firebase-functions');
const express = require('express');
const mathsteps = require('mathsteps');
const printUtil = require('mathsteps/lib/util/print');
const app = express();

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function renderNodeStatus(steps) { 
    const renderSolution = (step) => {
        return `${printUtil.ascii(step.oldNode)} ⟶ ${printUtil.ascii(step.newNode)}`;
    }

    return steps.map((step) => {
        let title = step.changeType.split("_").join(" ").toLowerCase();
        return {
            title: capitalize(title),
            content: renderSolution(step),
        }
    });
}




function renderEquationStatus(steps) {
    const renderSolution = (step) => {
        return `${step.oldEquation.ascii()} ⟶ ${step.newEquation.ascii()}`;
    }

    return steps.map((step) => {
        let title = step.changeType.split("_").join(" ").toLowerCase();
        return {
            title: capitalize(title),
            content: renderSolution(step)
        }
    })
}
app.get('/scan', (request, response) => {
    let equation = request.query.text;
    if (equation == '') {
        response.send([]);
    }
    const solvers = {
        solveEquation: mathsteps.solveEquation,
        factor: mathsteps.factor,
        simplifyExpression: mathsteps.simplifyExpression
    }

    let steps = [];
    let responseData = ""; 
    for (solver in solvers) { 
        steps = solvers[solver](equation);
        if (steps.length > 0) {
            // set the response data.
            responseData = solver == 'solveEquation' ? renderEquationStatus(steps) : renderNodeStatus(steps);
            break;
        }
    }
    response.send(responseData)
});
exports.app = functions.https.onRequest(app);
