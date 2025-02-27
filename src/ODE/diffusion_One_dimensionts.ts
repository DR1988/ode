import { throttle } from 'lodash'



export const draw1D_Diffusion = ({
  ctx,
  timeSteps,
  totalSteps,
  concentration,
}: {
  ctx: CanvasRenderingContext2D,
  timeSteps: number,
  totalSteps: number,
  concentration: number[][]
}) => {

  let currentTime = 0

  // const { Temp, N, } = resImp
  // console.log('Temp', Temp[0], N);

  const yMaxValue = 400
  const xMaxValue = 400
  const yBias = 30
  const xBias = 30
  const radius = 5

  const dotCoordanates: { x: number, y: number, concentration: number }[] = []

  const drawInitial = () => {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

    drawArrow(ctx, { fromx: xBias, fromy: yMaxValue + yBias, tox: xBias, toy: yBias })
    drawArrow(ctx, { fromx: xBias, fromy: yMaxValue + yBias, tox: xMaxValue + xBias, toy: yMaxValue + yBias })

    ctx.beginPath()
    drawText(ctx, { text: 'Concentration', x: xBias, y: (yMaxValue + yBias) / 2, direction: 'vertical' })
    drawText(ctx, { text: 'Time', x: (xMaxValue + xBias) / 2, y: yMaxValue + yBias })


    const viewStep = yMaxValue / totalSteps

    for (let step = 1; step < totalSteps; step++) {

      const value = concentration[currentTime][step - 1]
      const nextValue = concentration[currentTime][step]
      // console.log('viewStep * step - 1', viewStep * (step), step, yMaxValue - yMaxValue * nextValue, nextValue);
      // console.log('nextValue', viewStep * step, step);

      ctx.beginPath()

      if (step > 1) {
        ctx.arc(xBias + (viewStep * (step - 1)), yMaxValue - yMaxValue * value + yBias, radius, 0, 360);
        dotCoordanates.push({ x: xBias + (viewStep * (step - 1)), y: yMaxValue - yMaxValue * value + yBias, concentration: value })
        ctx.fillStyle = 'black'
        ctx.fill();
      }

      ctx.moveTo(xBias + (viewStep * (step - 1)), yMaxValue - yMaxValue * value + yBias);

      if (step === totalSteps - 1) {
        ctx.arc(xBias + (viewStep * step), yMaxValue - yMaxValue * nextValue + yBias, radius, 0, 360);
        dotCoordanates.push({ x: xBias + (viewStep * step), y: yMaxValue - yMaxValue * nextValue + yBias, concentration: value })
        ctx.fill();
      }

      ctx.lineTo(xBias + (viewStep * step), yMaxValue - yMaxValue * nextValue + yBias);

      ctx.strokeStyle = `rgb(0 ${Math.floor(255 - 62.5 * step * 2)} ${Math.floor(
        255 - 62.5 * step,
      )})`;
      ctx.stroke();
    }
  }

  drawInitial()

  console.log('dotCoordanates', dotCoordanates);

  let redraw = false
  const throttledMouseMove = throttle((event: MouseEvent) => {
    // console.log('event', event.offsetX, event.offsetY);
    const point = { x: event.offsetX, y: event.offsetY }
    const resultPoint = dotCoordanates.find(coord => {
      return isInCircle(coord, radius, point)
    })

    if (resultPoint) {
      ctx.beginPath()
      ctx.rect(resultPoint.x + 10, resultPoint.y + 10, 150, 50)
      ctx.fillStyle = 'black'
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.font = "14px Arial";
      // ctx.fillText(`Concentration: ${temperature.toFixed(2)}`, resultPoint.x + 10 + 5, resultPoint.y + 10 + 15);
      ctx.fillText(`Concentration: ${resultPoint.concentration.toFixed(3)}`, resultPoint.x + 10 + 5, resultPoint.y + 10 + 15);

      ctx.fillStyle = 'white'
      ctx.font = "11px Arial";
      redraw = true
      // const iIndex = `i: ${index};`
      // const { width } = ctx.measureText(iIndex)

      // ctx.fillText(iIndex, resultPoint.x + 10 + 5, resultPoint.y + 10 + 15 + 12);
      // ctx.fillText(`j: ${j};`, coorDiresultPointnate.x + 10 + 5 + width + 5, resultPoint.y + 10 + 15 + 12);
      // ctx.fillText(`timeStep: ${timeStep};`, coorDinate.x + 10 + 5, coorDinate.y + 10 + 15 + 27);
    } else {
      if (redraw) {
        redraw = false
        // ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
        drawInitial()
      }
    }

  }, 100)

  ctx.canvas.addEventListener('mousemove', throttledMouseMove)

  const timeButtonF = document.getElementById('timeButtonF') as (HTMLButtonElement | null)
  const timeButtonB = document.getElementById('timeButtonB') as (HTMLButtonElement | null)

  if (timeButtonF && timeButtonB) {
    timeButtonF.addEventListener('click', () => {
      if (currentTime < timeSteps - 1) {
        currentTime++
        drawInitial()
      }
    })

    timeButtonB.addEventListener('click', () => {
      if (currentTime > 0) {
        currentTime--
        drawInitial()
      }
    })
  }
}


function drawArrow(context: CanvasRenderingContext2D, { fromx, fromy, tox, toy }: { fromx: number, fromy: number, tox: number, toy: number }) {
  const headlen = 10; // length of head in pixels
  const angle = Math.atan2(toy - fromy, tox - fromx);

  context.beginPath();
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  context.stroke();
}

function drawText(
  context: CanvasRenderingContext2D,
  {
    text,
    x,
    y,
    fontSize = 18,
    direction = 'horizontal'
  }: { text: string, x: number, y: number, fontSize?: number, direction?: 'vertical' | 'horizontal' }) {


  if (direction === 'vertical') {
    const xpos = x - fontSize / 2
    context.save()
    context.translate(0, 0);
    context.rotate(3 * Math.PI / 2);
    context.translate(-y, xpos);
    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = 'black'
    context.fillText(text, 0, 0);
    context.restore()
  } else {

    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = 'black'
    context.fillText(text, x, y + fontSize);
  }

}

type Point = { x: number, y: number }

function isInCircle(center: Point, radius: number, point: Point) {
  return Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)) < radius
}