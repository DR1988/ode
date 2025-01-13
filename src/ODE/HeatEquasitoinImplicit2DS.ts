// const Chart = require('chart.js')
// import * as Chart from 'chart.js'


//Медь
const lamdaCu = 390 // теплопроводность //Медь
const cCu = 385 // теплоемкость //Медь
const DenseCu = 8960 // плотность //Медь


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
    /// https://portal.tpu.ru/SHARED/k/KRAYNOV/Study/Tab1/Tab/Kuznetsov%20Sheremet.pdf
    const Nx = 30
    const Ny = 30
    const time = 60
    const L = 0.5
    const H = 0.5
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
    const Thfunc = (index: number) => {
        const sigma = Ny / 2

        return T0 + 30 * Math.exp(-(((index - sigma) / 7) ** 2))
        // return T0 + 3 * index
    }
    const Tc = 30


    const hx = L / (Nx - 1)
    const hy = H / (Ny - 1)

    const alfa = lamdaCu / DenseCu / cCu // Температуропроводность

    const timeSteps = 1000
    const tau = time / timeSteps

    const xArray = Array.from(new Array(Nx)).map(i => 0)
    const yArray = Array.from(new Array(Ny)).map(i => 0)

    const alfaX = Array.from(new Array(Nx)).map(i => 0)
    const betaX = Array.from(new Array(Nx)).map(i => 0)

    // определяем начальные прогоночные коэффициенты на основе левого граничного условия


    const alfaY = Array.from(new Array(Ny)).map(i => 0)
    const betaY = Array.from(new Array(Ny)).map(i => 0)


    const Temp2D = Array.from(new Array(timeSteps))
        .map(_ => [...xArray].map(_ => [...yArray]))

    for (let t = 0; t < timeSteps; t++) {
        for (let xStep = 0; xStep < Nx; xStep++) {
            for (let yStep = 0; yStep < Ny; yStep++) {
                Temp2D[t][xStep][yStep] = T0
            }
        }
    }

    for (let t = 0; t < timeSteps; t++) {
        for (let j = 0; j < Ny; j++) {
            // Temp2D[t][0][j] = Th;
            Temp2D[t][Nx / 2][j] = Thfunc(j)
            // Temp2D[t][Nx - 1][j] = Tc;
        }
    }

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
                const fi = -DenseCu * cCu * Temp2D[t - 1][i][j] / tau; // используем предидущий слой времени для расчета

                // alfaX[i], betaX[i] – прогоночные коэффициенты}
                alfaX[i] = ai / (bi - ci * alfaX[i - 1]);
                betaX[i] = (ci * betaX[i - 1] - fi) / (bi - ci * alfaX[i - 1]);
            }

            Temp2D[t][Nx - 1][j] = T0; // определяем значение температуры на правой границе на основе правого граничного условия
            for (let i = Nx - 2; i > 0; i--) {
                Temp2D[t][i][j] = alfaX[i] * Temp2D[t][i + 1][j] + betaX[i];
            }
            Temp2D[t][Nx / 2][j] = Thfunc(j)

        }

        for (let i = 1; i < Nx - 2; i++) {

            // определяем начальные прогоночные коэффициенты на основе нижнего граничного условия, используя соотношения (20) при условии, что         q1 = 0
            // см сыылку в начале кода
            alfaY[0] = 2 * alfa * tau / (2 * alfa * tau + (hy * hy));
            betaY[0] = (hy * hy) * Temp2D[t][i][0] / (2 * alfa * tau + (hy * hy));

            for (let j = 1; j <= Ny - 1; j++) {
                const ai = lamdaCu / (hy * hy);
                const bi = 2 * lamdaCu / (hy * hy) + DenseCu * cCu / tau;
                const ci = lamdaCu / (hy * hy);
                const fi = -DenseCu * cCu * Temp2D[t][i][j] / tau; // используем текующий слой времени для расчета

                alfaY[j] = ai / (bi - ci * alfaY[j - 1]);
                betaY[j] = (ci * betaY[j - 1] - fi) / (bi - ci * alfaY[j - 1]);
            }

            Temp2D[t][i][Ny - 1] = (2 * alfa * tau * betaY[Ny - 2] + (hy * hy) * Temp2D[t - 1][i][Ny - 1]) /
                (2 * alfa * tau * (1 - alfaY[Ny - 2]) + (hy * hy)); // check

            for (let j = Ny - 2; j > 0; j--) {
                Temp2D[t][i][j] = alfaY[j] * Temp2D[t][i][j + 1] + betaY[j];
            }
        }

    }

    return {
        Temp2D,
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




