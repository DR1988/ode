// const Chart = require('chart.js')
// import * as Chart from 'chart.js'

const Ltotal = 0.5

const Tinit = (x, totalLength) => {
    const sigma = totalLength/2
    // return x
    return 20 + 30 * Math.exp(-(((x - sigma)/15)**2))
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

const getDense = (x, totalLength) => {
    // if (x > totalLength / 2) {
    //     return DenseSteel
    // }
    return DenseCu
}

const getTherma = (x, totalLength) => {
    // if (x > totalLength / 2) {
    //     return cSteel
    // }
    return cCu
}

const getLamda = (x, totalLength) => {
    // if (x > totalLength / 2) {
    //     return lamdaSteel
    // }
    return lamdaCu
}

export const heatSolutionImplicit = ({
    h,
    totalTime,
    length,
    Tinitial,
    tau,
    boundariesDistributionLeft,
    boundariesDistributionRight,
}: {
    h: number,
    totalTime: number,
    length: number,
    Tinitial: (i: number, N: number) => number,
    tau: number,
    boundariesDistributionLeft: () => number,
    boundariesDistributionRight: () => number,
}
) => {
    const N =  Math.round(length/h)
    const timeSteps = Math.round(totalTime / tau)
    
    const spaceArray = Array.from(new Array(N)).map(i => 0)
    const Temp = Array.from(new Array(timeSteps))
        .map(_ => [...spaceArray])
    const alfas = []
    const betas = []
    const alfa =  Array.from(new Array(N)).map(i => 0)
    const beta =  Array.from(new Array(N)).map(i => 0)

    let ref  = Array.from(new Array(N)).map((_, i) => Tinitial(i, N))

    for (let i = 0; i < N; i++) {
        Temp[0][i] = Tinitial(i, N)
    }

    // let ai = lamda / (h**2)
    // let bi = 2 * lamda / (h**2) + Dense * c / tau;
    // let ci = lamda / (h**2)
    let fi = 0

    alfa[0] = 0
    beta[0] = boundariesDistributionLeft()

    for (let j = 0; j < timeSteps; j++) {
        Temp[j][0] = boundariesDistributionLeft()
        Temp[j][N - 1] = boundariesDistributionRight()
    }


    for (let j = 1; j < timeSteps; j++) {

        for (let i = 1; i < N; i++) {
            let ai = getLamda(i*h, Ltotal) / (h**2)
            let bi = 2 * getLamda(i*h, Ltotal) / (h**2) + getDense(i*h, Ltotal) * getTherma(i*h, Ltotal) / tau;
            let ci = getLamda(i*h, Ltotal) / (h**2)
            fi = -getDense(i*h, Ltotal) * getTherma(i*h, Ltotal) * Temp[j-1][i] / tau

            alfa[i] = ai / (bi - ci * alfa[i-1]);
            beta[i] = (beta[i-1] * ci - fi)/(bi - ci * alfa[i-1]);
        }

        for (let i = N-2; i > 0; i--) {
            const alfai = alfa[i]

            const Ti = Temp[j][i+1]
            const betai = beta[i]
            Temp[j][i] = alfai * Ti + betai
        }
        alfas.push([...alfa])
        betas.push([...beta])

    }
    return {
        Temp,
        InitialRef: ref,
        N,
        tau
    }

}

const initialTemperDistribution = (x, totalLength) => {
    // const sigma = 2*totalLength/3
    // return 20 * Math.exp(-(((x - sigma)/2)**2))
    return x*60 * 100
}

export const resImp = heatSolutionImplicit({
      h:0.00333,
      totalTime:  60,
      length: Ltotal,
      Tinitial: Tinit,
      tau: 0.043,
      boundariesDistributionLeft: () => 20,
      boundariesDistributionRight:() => 20,
  }
)




