// const Chart = require('chart.js')
// import * as Chart from 'chart.js'

import {
    timeSteps, Nx,
    Ny,
    time,
    Length,
    Height
} from "./constants"


//Медь
const lamdaCu = 390 // теплопроводность //Медь
const cCu = 385 // теплоемкость //Медь
const DenseCu = 8960 // плотность //Медь

// МДШ метод - покоординатного расщепления и локально-одномерным методом или метод Самарского
// https://portal.tpu.ru/SHARED/k/KRAYNOV/Study/Tab1/Tab/Kuznetsov%20Sheremet.pdf
export const diffusionSolutionExplicit = ({
    h,
    totalTime,
    lengthX,
    lengthY,
    Tinitial,
    // tau,
    boundariesDistributionTop,
    boundariesDistributionBottom,
}: {
    h: number,
    totalTime: number,
    lengthX: number,
    lengthY: number,
    Tinitial: (i: number, Nx: number) => number,
    // tau: number,
    boundariesDistributionTop: () => number,
    boundariesDistributionBottom: () => number,
}
) => {


    const totalTimeValue = 0.02
    const tau = 0.005

    const stepSize = 0.2
    const totalLengt = 1

    const diffusion = 2

    const r = diffusion * tau / (stepSize * stepSize)

    console.log('r', r);

    const timeSteps = totalTimeValue / tau + 1
    const totalSteps = totalLengt / stepSize + 1

    const concentration: number[][] = new Array(timeSteps).fill(0).map(_ => new Array(totalSteps).fill(0))

    // boundary condition
    for (let time = 0; time < timeSteps; time++) {
        concentration[time][0] = 0
        concentration[time][totalSteps - 1] = 1
    }

    // initial condition
    for (let step = 0; step < totalSteps; step++) {
        concentration[0][step] = step * stepSize * (2 - step * stepSize)
    }
    console.log('concentration', structuredClone(concentration));

    for (let time = 0; time < timeSteps - 1; time++) {
        for (let step = 1; step < totalSteps - 1; step++) {
            concentration[time + 1][step] = r * concentration[time][step - 1] + (1 - 2 * r) * concentration[time][step] + r * concentration[time][step + 1]
        }
    }

    console.log('concentration', concentration);


    return {
        concentration,
        totalSteps,
        timeSteps,
        stepSize,
        tau,
    }

}


export const concentration1D = diffusionSolutionExplicit({
    // h:0.000333,
    h: 0.0045,
    totalTime: 840,
    lengthX: 0.5,
    lengthY: 0.5,
    Tinitial: () => 20,
    boundariesDistributionTop: () => 300,
    boundariesDistributionBottom: () => 1000,
}
)




