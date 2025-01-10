import {resImp} from './ODE/HeatEquasitoinImplicit'
import { getColors } from './rgbToTemp';

const handleMouseMove = () => console.log(123)
let currentTime = 0

const increseTime = () => {
    currentTime++
    timeText.innerText = `time: ${currentTime}`
}

const canvas = document.getElementById('canvas') as (HTMLCanvasElement | null)
const timeButton = document.getElementById('timeButton') as (HTMLButtonElement | null)
const timeText = document.getElementById('timeText') as (HTMLSpanElement | null)

const {Temp, InitialRef, N,} = resImp

// console.log('Temp',  Temp[0], );
console.log('resImp.Temp', N);

const maxArray = Temp.map(t => Math.max(...t))
const minArray = Temp.map(t => Math.min(...t))

const maxTemp = Math.max(...maxArray)
const minTemp = Math.min(...minArray)

const scaleFactor = 4

const draw = (ctx: CanvasRenderingContext2D, colors: string[], getRGBColor: (temp: number) => string) => {
  let finished = false
    const offset =  50

    for (let index = 0; index < 256; index++) {
        

        ctx.beginPath()
        ctx.rect(0, index + 100 , offset - 10, 1)
        ctx.fillStyle = colors[index]
        ctx.fill()

        // ctx.beginPath()
        // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][1])
        // ctx.fillStyle = 'green' 
        // ctx.fill()

        // ctx.beginPath()
        // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][0])
        // ctx.fillStyle = 'red' 
        // ctx.fill()

        // ctx.beginPath()
        // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][2])
        // ctx.fillStyle = 'blue'
        // ctx.fill()
    }

    for (let index = 0; index < N; index++) {
       const timeTempLayer = Temp[currentTime]
       if (timeTempLayer) {

       const color = getRGBColor(Temp[currentTime][index])
        ctx.beginPath()
        ctx.rect(offset +  scaleFactor * index, 200 ,scaleFactor * 1, 55)
        ctx.fillStyle = color
        ctx.fill()
       } else {
        finished = true
       }

    }

        ctx.beginPath()
        ctx.rect(offset, 357 , 255, 2)
        ctx.fillStyle = 'black'
        ctx.fill()

        return finished
}

if (canvas && timeButton) {
    const ctx = canvas.getContext('2d')
    const {indexToTemp, rgbTemp, colors, getRGBColor} = getColors(maxTemp, minTemp)

    // console.log('asdad',     getRGBColor(20.4));
    // timeButton.addEventListener('click', () => {
    //     increseTime()
    //     draw(ctx, colors, getRGBColor)
    //   }
    // )

    const timeId = setInterval(() => {
      increseTime()
      const isFinished = draw(ctx, colors, getRGBColor)
      if (isFinished) {
        clearInterval(timeId)
      }
    }, 30);

    const offset =  50

    draw(ctx, colors, getRGBColor)
    // for (let index = 0; index < 256; index++) {
        

    //     ctx.beginPath()
    //     ctx.rect(0, index + 100 , offset - 10, 1)
    //     ctx.fillStyle = colors[index]
    //     ctx.fill()

    //     // ctx.beginPath()
    //     // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][1])
    //     // ctx.fillStyle = 'green' 
    //     // ctx.fill()

    //     // ctx.beginPath()
    //     // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][0])
    //     // ctx.fillStyle = 'red' 
    //     // ctx.fill()

    //     // ctx.beginPath()
    //     // ctx.rect(offset + index, 355 , 1, -rgbTemp[index][2])
    //     // ctx.fillStyle = 'blue'
    //     // ctx.fill()
    // }

    // for (let index = 0; index < N; index++) {
    //    const timeTempLayer = Temp[currentTime]
    //    if (timeTempLayer) {

    //    const color = getRGBColor(Temp[currentTime][index])
    // //    console.log('colors', colors);
    //     ctx.beginPath()
    //     ctx.rect(offset +  scaleFactor * index, 200 ,scaleFactor * 1, 55)
    //     ctx.fillStyle = color
    //     ctx.fill()
    //    }

    // }
        // ctx.beginPath()
        // ctx.rect(offset, 200 , N, 55)
        // ctx.fillStyle = 'red'
        // ctx.fill()

        // ctx.beginPath()
        // ctx.rect(offset, 357 , 255, 2)
        // ctx.fillStyle = 'black'
        // ctx.fill()

                

}
