export const timeSteps = 250
export const rectHeight = 240

export const Nx = 30
export const Ny = 30
export const time = 60
export const Length = 0.5
export const Height = 0.5

export const scaleFactor = rectHeight / Nx

const lamdaCu = 390
const cCu = 385
const DenseCu = 8960

const alfa = lamdaCu / DenseCu / cCu
const hx = Length / (Nx - 1)
const tau = time / timeSteps

console.log('tau', tau);
// console.log('hx * hx', hx * hx);

const result = (hx * hx) / alfa

console.log('result', result);
console.log('compare', tau < result);

// console.log('alfa', alfa);
// console.log('alfa > result', alfa > result);
