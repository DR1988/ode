import { timeSteps } from './ODE/constants';
import { resImp } from './ODE/HeatEquasitoinImplicit'
// import { resImp2D } from './ODE/HeatEquasitoinImplicit2D'
import { resImp2Ds } from './ODE/HeatEquasitoinImplicit2DS'
import { draw1D } from './ODE/One_dimension';
import { draw2D } from './ODE/two_dimension';
import { getColors } from './rgbToTemp';
import { draw1D_Diffusion } from './ODE/diffusion_One_dimensionts';
import { concentration1D } from './ODE/DiffusionEquasitoinImplicit2DS'


// console.log('resImp2Ds', resImp2Ds.Temp2D);
// console.log('resImp', resImp);


const handleMouseMove = () => console.log(123)
let currentTime = 0

const timeStep = 1
const changeTime = (value: number) => {
  // currentTime += timeStep
  currentTime = value
  timeText.innerText = `time: ${currentTime}`
}

const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null)
const timeButtonF = document.getElementById('timeButtonF') as (HTMLButtonElement | null)
const timeButtonB = document.getElementById('timeButtonB') as (HTMLButtonElement | null)
const startStop = document.getElementById('startStop') as (HTMLButtonElement | null)
const timeText = document.getElementById('timeText') as (HTMLSpanElement | null)
const rangeInput = document.getElementById('rangeInput') as (HTMLInputElement | null)



const { Temp, N, } = resImp
// const { Temp2D, Nx, Ny } = resImp2D
const { Temp2D, Nx, Ny } = resImp2Ds
const { concentration, timeSteps: timeStepsDiffusion, totalSteps } = concentration1D

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


if (canvas && timeButtonF && timeButtonB && rangeInput) {
  let run = false
  let timeId

  rangeInput.setAttribute('min', '0')
  rangeInput.setAttribute('max', timeSteps.toString())
  const ctx = canvas.getContext('2d')
  const { colors: colors2D, getRGBColor: getRGBColor2D } = getColors(maxTemp2D, mimTemp2D)
  const { colors, getRGBColor } = getColors(maxTemp, minTemp)

  draw1D_Diffusion({ ctx, timeSteps: timeStepsDiffusion, totalSteps, concentration })
  // draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
  // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
  // _getTempMapValue = getTempMapValue

  timeButtonF.addEventListener('click', () => {
    // const value = currentTime + timeStep

    // if (value <= timeSteps) {
    //   changeTime(value)
    //   rangeInput.value = (value).toString()

    //   const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    //   _getTempMapValue = getTempMapValue

    //   // draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
    // }
  })

  timeButtonB.addEventListener('click', () => {
    const value = currentTime - timeStep
    if (value >= 0) {
      changeTime(value)
      rangeInput.value = (value).toString()

      // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
      // _getTempMapValue = getTempMapValue

      // draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
    }
  })

  canvas.addEventListener('click', (event) => {
    // console.log('event', event.clientX, event.clientY);
    // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    // _getTempMapValue = getTempMapValue

    // getTempMapValue(event.clientX, event.clientY)
  })

  canvas.addEventListener('mousemove', (event) => {
    // console.log('event', event.clientX, event.clientY);
    // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    // _getTempMapValue = getTempMapValue

    // getTempMapValue(event.clientX, event.clientY)
  })

  canvas.addEventListener('mouseleave', (event) => {
    // console.log('event', event.clientX, event.clientY);
    // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime })
    // _getTempMapValue = getTempMapValue

    // getTempMapValue(event.clientX, event.clientY)
  })

  // rangeInput.addEventListener('mousedown', (event) => {
  // })

  rangeInput.addEventListener('change', (event) => {
    if (event.target.value) {
      const value = Number(event.target.value)
      changeTime(value)

      // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime, })
      // _getTempMapValue = getTempMapValue
    }
  })

  // const timeId = setInterval(() => {
  //   changeTime(currentTime + timeStep)
  //   const isFinished = draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
  //   const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime, })
  //   _getTempMapValue = getTempMapValue

  //   if (isFinished2) {
  //     clearInterval(timeId)
  //   }
  // }, 30);


  const start = () => {
    run = true
    startStop.innerHTML = 'Stop'
    timeId = setInterval(() => {
      const value = currentTime + 1
      changeTime(value)
      // const isFinished = draw1D({ ctx, colors, getRGBColor, resImp, timeStep: currentTime })
      // const { finished: isFinished2, getTempMapValue } = draw2D({ ctx, colors: colors2D, getRGBColor: getRGBColor2D, resImp2D: resImp2Ds, timeStep: currentTime, })
      // _getTempMapValue = getTempMapValue

      rangeInput.value = (value).toString()
      // if (isFinished2) {
      //   clearInterval(timeId)
      //   startStop.innerHTML = 'Start'
      //   run = false
      // }
    }, 30);
  }

  const stop = () => {
    run = false
    startStop.innerHTML = 'Start'
    clearInterval(timeId)
  }

  const togleProcess = () => {
    if (run) {
      stop()
    } else {
      if (currentTime >= timeSteps) {
        currentTime = 0
      }
      start()
    }
  }


  startStop.addEventListener('click', togleProcess)

}
