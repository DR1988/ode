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
export const heatSolutionImplicit = ({
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


    // copper
    const lamdaCu = 390
    const cCu = 385
    const DenseCu = 8960

    //сталь
    // const lamdaCu = 46 // теплопроводность //сталь
    // const cCu = 460 // теплоемкость //сталь
    // const DenseCu = 7800 // плотность //сталь

    // алюминий
    // const lamdaCu = 237  // теплопроводность //сталь
    // const cCu = 897 // теплоемкость //сталь
    // const DenseCu = 2698 // плотность //сталь

    const T0 = 5
    const Th = 80
    const Tlaser = 230
    const Tc = 30

    const Thfunc = (index: number) => {
        const sigma = Ny / 2

        return T0 + 30 * Math.exp(-(((index - sigma) / 7) ** 2))
    }

    const Tgaus = (index: number, Tmax: number) => {
        const sigma = Ny / 2

        return T0 + Tmax * Math.exp(-(((index - sigma) / 7) ** 2))
    }

    const TgausPlain = (i: number, j: number) => {
        const sigmay = Ny / 2
        const sigmax = Nx / 2
        const jValue = T0 + 30 * Math.exp(-(((j - sigmay) / 7) ** 2))
        const iValue = T0 + jValue * Math.exp(-(((i - sigmax) / 7) ** 2))
        // console.log('jValue', jValue, xValue);
        return { jValue, iValue }
        // return T0 + 3 * index
    }


    const hx = Length / (Nx - 1)
    const hy = Height / (Ny - 1)

    const alfa = lamdaCu / DenseCu / cCu // Температуропроводность

    const tau = time / timeSteps

    const xArray = Array.from(new Array(Nx)).map(i => 0)
    const yArray = Array.from(new Array(Ny)).map(i => 0)

    const alfaX = Array.from(new Array(Nx)).map(i => 0)
    const betaX = Array.from(new Array(Nx)).map(i => 0)

    // определяем начальные прогоночные коэффициенты на основе левого граничного условия


    const alfaY = Array.from(new Array(Ny)).map(i => 0)
    const betaY = Array.from(new Array(Ny)).map(i => 0)


    const timeTempLayers: number[][][] = []
    const Temp2Ds: number[][] = new Array(Nx).fill(0).map(_ => new Array(Ny).fill(0))
    // .map(_ => [...yArray])

    for (let xStep = 0; xStep < Nx; xStep++) {
        for (let yStep = 0; yStep < Ny; yStep++) {
            Temp2Ds[xStep][yStep] = T0
        }
    }


    /* gauss distribution
        // const test: number[][] = [new Array(Nx)]
        // for (let index = 0; index < Nx; index++) {
        //     const arr = []
        //     for (let ji = 0; ji < Ny; ji++) {
        //         arr.push(0)
        //     }
        //     test[index] = arr
        // }
    
        // let igausV = 0
        // let jgausV = 0
        // for (let j = 0; j < Ny; j++) {
        //     igausV = Tgaus(j, 30)
        //     test[Nx / 2][j] = igausV
        // }
    
        // for (let i = 0; i < Nx; i++) {
        //     for (let j = 0; j < Ny; j++) {
        //         jgausV = Tgaus(i, test[Nx / 2][j])
        //         test[i][j] = jgausV
        //     }
        // }
    */



    for (let i = 0; i < Nx; i++) {
        for (let j = 0; j < Ny; j++) {
            Temp2Ds[0][j] = T0;
            // Temp2Ds[t][Nx / 2][j] = Thfunc(j)
            // Temp2Ds[t][Nx - 1][j] = Tc;
        }
    }

    const laserBeam = () => {
        for (let t = 0; t < timeSteps; t++) {

            Temp2Ds[Nx / 2][Ny / 2] = Tlaser
            // Temp2Ds[Nx / 2][Ny / 2 + 1] = Tlaser
            // Temp2Ds[Nx / 2 - 1][Ny / 2] = Tlaser
            // Temp2Ds[Nx / 2 - 1][Ny / 2 + 1] = Tlaser
        }
    }
    laserBeam()



    timeTempLayers.push(structuredClone(Temp2Ds))
    for (let t = 1; t < timeSteps; t++) {

        // debugger
        for (let j = 0; j < Ny; j++) {
            alfaX[0] = 0
            betaX[0] = T0

            // betaX[2] = Th
            // betaX[0] = Tc //Thfunc(j)

            for (let i = 1; i < Nx; i++) {
                // ai, bi, ci, fi – коэффициенты канонического представления СЛАУ с трехдиагональной матрицей
                const ai = lamdaCu / (hx * hx);
                const bi = 2 * lamdaCu / (hx * hx) + DenseCu * cCu / tau;
                const ci = lamdaCu / (hx * hx);
                const fi = -DenseCu * cCu * Temp2Ds[i][j] / tau; // используем предидущий слой времени для расчета

                // alfaX[i], betaX[i] – прогоночные коэффициенты}
                alfaX[i] = ai / (bi - ci * alfaX[i - 1]);
                betaX[i] = (ci * betaX[i - 1] - fi) / (bi - ci * alfaX[i - 1]);

                // ci > 0 // stable
                //ai > 0// stable
                //bi >= ci + ai// stable
                if (Math.abs(alfaX[i]) > 1) {
                    console.log('UNSTABLE');
                }
                if (ci <= 0 || ai <= 0 || bi < ci + ai) {
                    console.log('UNSTABLE');
                }
            }

            Temp2Ds[Nx - 1][j] = T0; // определяем значение температуры на правой границе на основе правого граничного условия
            for (let i = Nx - 2; i > 0; i--) {
                Temp2Ds[i][j] = alfaX[i] * Temp2Ds[i + 1][j] + betaX[i];
            }
            laserBeam()
        }

        for (let i = 1; i < Nx - 2; i++) {

            // определяем начальные прогоночные коэффициенты на основе нижнего граничного условия, используя соотношения (20) при условии, что         q1 = 0
            // см сыылку в начале кода
            alfaY[0] = 2 * alfa * tau / (2 * alfa * tau + (hy * hy));
            betaY[0] = (hy * hy) * Temp2Ds[i][0] / (2 * alfa * tau + (hy * hy));

            for (let j = 1; j <= Ny - 1; j++) {
                const ai = lamdaCu / (hy * hy);
                const bi = 2 * lamdaCu / (hy * hy) + DenseCu * cCu / tau;
                const ci = lamdaCu / (hy * hy);
                const fi = -DenseCu * cCu * Temp2Ds[i][j] / tau; // используем текующий слой времени для расчета

                alfaY[j] = ai / (bi - ci * alfaY[j - 1]);
                betaY[j] = (ci * betaY[j - 1] - fi) / (bi - ci * alfaY[j - 1]);
                if (Math.abs(alfaY[j]) > 1) {
                    console.log('UNSTABLE');
                }
                if (ci <= 0 || ai <= 0 || bi < ci + ai) {
                    console.log('UNSTABLE');
                }
            }

            Temp2Ds[i][Ny - 1] = (2 * alfa * tau * betaY[Ny - 2] + (hy * hy) * Temp2Ds[i][Ny - 1]) /
                (2 * alfa * tau * (1 - alfaY[Ny - 2]) + (hy * hy)); // check

            for (let j = Ny - 2; j > 0; j--) {
                Temp2Ds[i][j] = alfaY[j] * Temp2Ds[i][j + 1] + betaY[j];
            }
            laserBeam()

        }

        timeTempLayers.push(structuredClone(Temp2Ds))
    }




    return {
        Temp2D: timeTempLayers,
        Nx,
        tau,
        Ny
    }

}


export const resImp2Ds = heatSolutionImplicit({
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




