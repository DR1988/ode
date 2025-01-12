import { resImp } from './ODE/HeatEquasitoinImplicit'
import { resImp2D } from './ODE/HeatEquasitoinImplicit2D'
import { resImp2Ds } from './ODE/HeatEquasitoinImplicit2DS'
import { draw1D } from './ODE/One_dimension';
import { test } from './ODE/test';
import { draw2D } from './ODE/two_dimension';
import { getColors } from './rgbToTemp';


console.log('resImp2Ds', resImp2Ds.Temp2D);
console.log('resImp', resImp);

const handleMouseMove = () => console.log(123)
let currentTime = 0

const timeStep = 1
const increseTime = () => {
  currentTime += timeStep
  timeText.innerText = `time: ${currentTime}`
}

const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null)
const timeButton = document.getElementById('timeButton') as (HTMLButtonElement | null)
const timeText = document.getElementById('timeText') as (HTMLSpanElement | null)

const { Temp, N, } = resImp
// const { Temp2D, Nx, Ny } = resImp2D
const { Temp2D, Nx, Ny } = resImp2Ds

const maxArray = Temp.map(t => Math.max(...t))
const minArray = Temp.map(t => Math.min(...t))

const maxTemp = Math.max(...maxArray)
const minTemp = Math.min(...minArray)

let maxTemp2D = Number.MIN_VALUE
let mimTemp2D = Number.MAX_VALUE

Temp2D.flat(2).forEach((el, index) => {
  if (el > maxTemp2D) {
    maxTemp2D = el
  }
  if (el < mimTemp2D) {
    mimTemp2D = el

  }
});

// const maxArray2D= Temp2D.map(t => Math.max(...t))
// const minArray2D = Temp2D.map(t => Math.min(...t))
// console.log('mimTemp2D', mimTemp2D);
// console.log('maxTemp2D', maxTemp2D);
// console.log('Temp2D', Temp2D);

let _getTempMapValue = (x: number, y: number) => {
  console.log('NOT SET');
}

if (canvas && timeButton) {
  const ctx = canvas.getContext('2d')
  const { colors: colors2D, getRGBColor: getRGBColor2D } = getColors(maxTemp2D, mimTemp2D)
  const { colors, getRGBColor } = getColors(maxTemp, minTemp)

  draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
  const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
  _getTempMapValue = getTempMapValue

  timeButton.addEventListener('click', () => {
    increseTime()
    const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    _getTempMapValue = getTempMapValue

    draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
  })

  canvas.addEventListener('click', (event) => {
    // console.log('event', event.clientX, event.clientY);
    const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    _getTempMapValue = getTempMapValue

    _getTempMapValue(event.clientX, event.clientY)
  })

  const timeId = setInterval(() => {
    increseTime()
    const isFinished = draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
    const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime, })
    _getTempMapValue = getTempMapValue

    if (isFinished || isFinished2) {
      clearInterval(timeId)
    }
  }, 30);



}
