const scaleFactor = 5

export const draw1D = ({
  ctx,
  colors,
  getRGBColor,
  resImp,
  timeStep,
}: {
  ctx: CanvasRenderingContext2D,
  colors: string[],
  getRGBColor: (temp: number) => string,
  resImp: {
    Temp: number[][],
    N: number,
    tau: number,
  },
  timeStep: number
}
) => {
  const { Temp, N, } = resImp
  // console.log('Temp', Temp[0], N);

  let finished = false
  const offset = 50

  for (let index = 0; index < 256; index++) {


    ctx.beginPath()
    ctx.rect(0, index + 20, offset - 10, 1)
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
    const timeTempLayer = Temp[timeStep]
    if (timeTempLayer) {

      const color = getRGBColor(Temp[timeStep][index])

      ctx.beginPath()
      ctx.rect(offset + scaleFactor * index, 40, scaleFactor * 1, 55)
      ctx.fillStyle = color
      ctx.fill()
    } else {
      finished = true
    }

  }

  // ctx.beginPath()
  // ctx.rect(offset, 357, 255, 2)
  // ctx.fillStyle = 'black'
  // ctx.fill()

  return finished
}
