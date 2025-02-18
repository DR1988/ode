import { scaleFactor, Nx, Ny } from "./constants"

// const scaleFactor = 8
const verticalOffset = 300

let infoContainer = () => { }

export const draw2D = ({
  ctx,
  colors,
  getRGBColor,
  resImp2D,
  timeStep,
}: {
  ctx: CanvasRenderingContext2D,
  colors: string[],
  getRGBColor: (temp: number) => string,
  resImp2D: {
    Temp2D: number[][][],
    Nx: number,
    tau: number,
    Ny: number,
  },
  timeStep: number
}
) => {
  let finished = false
  const offset = 50
  const { Temp2D } = resImp2D

  const draw = () => {
    ctx.clearRect(0, verticalOffset, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    // infoContainer()

    for (let index = 0; index < 256; index++) {


      ctx.beginPath()
      ctx.rect(0, index + verticalOffset, offset - 10, 1)
      ctx.fillStyle = colors[index]
      ctx.fill()

    }


    const timeTempLayer = Temp2D[timeStep]
    if (timeTempLayer) {
      for (let index = 0; index < Nx; index++) {
        for (let j = 0; j < Ny; j++) {

          const coorDinate = {
            x: offset + scaleFactor * index,
            y: verticalOffset + scaleFactor * j,
            width: scaleFactor * 1,
            height: scaleFactor * 1
          }

          const temperature = timeTempLayer[index][j]
          const color = getRGBColor(temperature)
          ctx.beginPath()
          ctx.rect(coorDinate.x, coorDinate.y, coorDinate.width, coorDinate.height)
          ctx.fillStyle = color
          ctx.fill()


        }
      }
      infoContainer()

    } else {
      finished = true
      const timeTempLayer = Temp2D[timeStep - 1]
      if (timeTempLayer) {
        for (let index = 0; index < Nx; index++) {
          for (let j = 0; j < Ny; j++) {

            const coorDinate = {
              x: offset + scaleFactor * index,
              y: verticalOffset + scaleFactor * j,
              width: scaleFactor * 1,
              height: scaleFactor * 1
            }

            const temperature = timeTempLayer[index][j]
            const color = getRGBColor(temperature)
            ctx.beginPath()
            ctx.rect(coorDinate.x, coorDinate.y, coorDinate.width, coorDinate.height)
            ctx.fillStyle = color
            ctx.fill()
            // infoContainer()

          }
        }
      }
    }

    ctx.beginPath()
    ctx.rect(offset, verticalOffset + 260, scaleFactor * Nx, 2)
    ctx.fillStyle = 'black'
    ctx.fill()

    for (let index = 0; index <= 5; index++) {
      ctx.rect(offset + scaleFactor * Nx / 5 * index, verticalOffset + 250, 2, 10)
      ctx.fill()

    }
  }

  draw()

  const getTempMapValue = (x: number, y: number) => {
    // console.log(tempMap);
    if (finished) {
      draw()
    }

    const timeTempLayer = Temp2D[timeStep]
    if (timeTempLayer) {
      for (let index = 0; index < Nx; index++) {
        for (let j = 0; j < Ny; j++) {

          const coorDinate = {
            x: offset + scaleFactor * index,
            y: verticalOffset + scaleFactor * j,
            width: scaleFactor * 1,
            height: scaleFactor * 1
          }

          const temperature = timeTempLayer[index][j]
          const color = getRGBColor(temperature)
          if (
            x - 8 > coorDinate.x &&
            x - 8 <= coorDinate.x + coorDinate.width &&
            y - 8 > coorDinate.y &&
            y - 8 <= coorDinate.y + coorDinate.height
          ) {
            infoContainer = () => {
              ctx.beginPath()
              ctx.rect(coorDinate.x + 10, coorDinate.y + 10, 150, 50)
              ctx.fillStyle = 'black'
              ctx.fill()
              ctx.fillStyle = 'white'
              ctx.font = "14px Arial";
              ctx.fillText(`Temp: ${temperature.toFixed(2)}`, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15);

              ctx.fillStyle = 'white'
              ctx.font = "11px Arial";
              const iIndex = `i: ${index};`
              const { width } = ctx.measureText(iIndex)

              ctx.fillText(iIndex, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15 + 12);
              ctx.fillText(`j: ${j};`, coorDinate.x + 10 + 5 + width + 5, coorDinate.y + 10 + 15 + 12);
              ctx.fillText(`timeStep: ${timeStep};`, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15 + 27);

            }
            // ctx.beginPath()
            // ctx.rect(coorDinate.x + 10, coorDinate.y + 10, 150, 30)
            // ctx.fillStyle = 'black'
            // ctx.fill()
            // console.log('element', color, temperature);
          }
        }
      }
    } else {
      const timeTempLayer = Temp2D[timeStep - 1]

      for (let index = 0; index < Nx; index++) {
        for (let j = 0; j < Ny; j++) {
          const coorDinate = {
            x: offset + scaleFactor * index,
            y: verticalOffset + scaleFactor * j,
            width: scaleFactor * 1,
            height: scaleFactor * 1
          }

          const temperature = timeTempLayer[index][j]
          const color = getRGBColor(temperature)
          if (
            x - 8 > coorDinate.x &&
            x - 8 <= coorDinate.x + coorDinate.width &&
            y - 8 > coorDinate.y &&
            y - 8 <= coorDinate.y + coorDinate.height
          ) {
            // ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
            ctx.beginPath()
            ctx.rect(coorDinate.x + 10, coorDinate.y + 10, 150, 50)
            ctx.fillStyle = 'black'
            ctx.fill()
            ctx.fillStyle = 'white'
            ctx.font = "14px Arial";
            ctx.fillText(`Temp: ${temperature.toFixed(2)}`, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15);

            ctx.fillStyle = 'white'
            ctx.font = "11px Arial";
            const iIndex = `i: ${index};`
            const { width } = ctx.measureText(iIndex)

            ctx.fillText(iIndex, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15 + 12);
            ctx.fillText(`j: ${j};`, coorDinate.x + 10 + 5 + width + 5, coorDinate.y + 10 + 15 + 12);
            ctx.fillText(`timeStep: ${timeStep};`, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15 + 27);
            // console.log('element', color, temperature);
          }
        }
      }
    }
  }

  return { finished, getTempMapValue }
}
