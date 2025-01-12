// const Chart = require('chart.js')
// import * as Chart from 'chart.js'

const Ltotal = 0.5

const Tinit = (x, totalLength) => {
    const sigma = totalLength / 2
    // return 20
    // return 20 + x

    return 20 + 30 * Math.exp(-(((x - sigma) / 15) ** 2))
}

const q = 100000 // плотность теплого потока
const Tamb = 20 // температура окружающей среды
const alpha = 5000 //  коэффициент теплоотдачи жидкости


//сталь
const lamdaSteel = 46 // теплопроводность //сталь
const cSteel = 460 // теплоемкость //сталь
const DenseSteel = 7800 // плотность //сталь

//Медь
const lamdaCu = 390 // теплопроводность //Медь
const cCu = 385 // теплоемкость //Медь
const DenseCu = 8960 // плотность //Медь

const getDense = (x?, totalLength?) => {
    // if (x > totalLength / 2) {
    //     return DenseSteel
    // }
    return DenseCu
}

const getTherma = (x?, totalLength?) => {
    // if (x > totalLength / 2) {
    //     return cSteel
    // }
    return cCu
}

const getLamda = (x?, totalLength?) => {
    // if (x > totalLength / 2) {
    //     return lamdaSteel
    // }
    return lamdaCu
}

export const heatSolutionImplicit = ({
    h,
    totalTime,
    lengthX,
    lengthY,
    Tinitial,
    tau,
    boundariesDistributionTop,
    boundariesDistributionBottom,
}: {
    h: number,
    totalTime: number,
    lengthX: number,
    lengthY: number,
    Tinitial: (i: number, Nx: number) => number,
    tau: number,
    boundariesDistributionTop: () => number,
    boundariesDistributionBottom: () => number,
}
) => {
    console.log(12313123123);

    const Nx = Math.round(lengthX / h)


    const Ny = Math.round(lengthY / h)
    const timeSteps = Math.round(totalTime / tau)

    console.log('Nx', Nx, timeSteps);

    const xArray = Array.from(new Array(Nx)).map(i => 0)
    const yArray = Array.from(new Array(Ny)).map(i => 0)

    const Temp2D = Array.from(new Array(timeSteps))
        .map(_ => [...xArray].map(_ => [...yArray]))


    // const Temp2D: number[][][] = []

    // initial condition
    for (let t = 0; t < timeSteps; t++) {
        for (let x = 0; x < Nx; x++) {
            for (let y = 0; y < Ny; y++) {
                Temp2D[t][x][y] = 20
            }
        }
    }

    for (let i = 0; i < Nx; i++) {
        Temp2D[0][i][0] = Tinit(i, Nx) // boundariesDistributionTop() //Tinitial(i, Nx)
        // Temp2D[0][i][Ny - 1] = 20 // boundariesDistributionBottom() //Tinitial(i, Nx)
    }

    // for (let j = 0; j < Ny; j++) {
    //     Temp2D[0][0][j] = 1000 //Tinitial(i, Nx)
    //     Temp2D[0][Nx - 1][j] = 1000 //Tinitial(i, Nx)
    // }

    //  const alfasX = []
    //  const betasX = []
    const alfaX = Array.from(new Array(Nx)).map(i => 0)
    const betaX = Array.from(new Array(Nx)).map(i => 0)

    const alfaY = Array.from(new Array(Ny)).map(i => 0)
    const betaY = Array.from(new Array(Ny)).map(i => 0)
    // let ai = lamda / (h**2)
    // let bi = 2 * lamda / (h**2) + Dense * c / tau;
    // let ci = lamda / (h**2)
    let fi = 0

    alfaX[0] = 0
    betaX[0] = 20 // boundariesDistributionTop()

    alfaY[0] = 0
    betaY[0] = 20 //boundariesDistributionBottom()


    for (let t = 1; t < timeSteps; t++) {
        let ai = getLamda() / (h ** 2)
        let bi = 2 * getLamda() / (h ** 2) + getDense() * getTherma() / tau;
        let ci = getLamda() / (h ** 2)
        for (let j = 0; j < Ny; j++) {

            for (let i = 1; i < Nx; i++) {
                fi = -getDense() * getTherma() * Temp2D[t - 1][i][j] / tau
                alfaX[i] = ai / (bi - ci * alfaX[i - 1]);
                betaX[i] = (betaX[i - 1] * ci - fi) / (bi - ci * alfaX[i - 1]);
            }
            // Temp2D[t][j][Nx] = boundariesDistributionBottom()
            for (let i = Nx - 2; i > 0; i--) {
                Temp2D[t][i][j] = alfaX[i] * Temp2D[t][i + 1][j] + betaX[i]
            }
        }

        // for (let i = 1; i <= Nx; i++) {
        //     Temp2D[t][0][i] = Temp2D[t][1][i]; // boundary condition for T(x, 0)
        //     Temp2D[t][Ny - 1][i] = Temp2D[t][Ny - 1][i]; // boundary condition for T(x, Ly)
        // }

        for (let i = 0; i < Nx; i++) {

            for (let j = 1; j < Ny; j++) {

                fi = -getDense() * getTherma() * Temp2D[t - 1][i][j] / tau
                alfaY[j] = ai / (bi - ci * alfaY[j - 1]);
                betaY[j] = (betaY[j - 1] * ci - fi) / (bi - ci * alfaY[j - 1]);
            }
            for (let j = Ny - 2; j > 0; j--) {
                Temp2D[t][i][j] = alfaY[j] * Temp2D[t][i][j + 1] + betaY[j]
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

export const resImp2D = heatSolutionImplicit({
    h: 0.01,
    totalTime: 40,
    // h: 0.00333,
    // totalTime: 60,
    lengthX: Ltotal,
    lengthY: Ltotal,
    Tinitial: Tinit,
    tau: 0.043,
    boundariesDistributionTop: () => 300,
    boundariesDistributionBottom: () => 1000,
}
)




