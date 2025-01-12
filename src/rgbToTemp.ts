
const sigmaG = 14000
const sigmaR = 22000
const sigmaB = 22000

export const getColors = (maxTemp: number, minTemp: number) => {

    const rangeStep = (maxTemp - minTemp) / 255
    const indexToTemp: number[] = []
    const rgbTemp: [number, string][] = []

    const getRedColor = (index: number): number => {
        return Math.round(255 * (Math.pow(Math.E, -Math.pow(index - 255, 2) / sigmaR)))
    }

    const getGreenColor = (index: number): number => {

        return Math.round(255 * (Math.pow(Math.E, -Math.pow(index - 255 / 2, 2) / sigmaG)))
    }

    const getBlueColor = (index: number): number => {
        return Math.round(255 * (Math.pow(Math.E, -Math.pow(index, 2) / sigmaB)))
    }

    const colors = []
    for (let index = 0; index < 256; index++) {
        const value = rangeStep * index

        indexToTemp.push(minTemp + value)

        const red = getRedColor(index)
        const green = getGreenColor(index)
        const blue = getBlueColor(index)
        const color = `rgba(${red}, ${green}, ${blue}, 1)`
        // console.log(minTemp + value, color);

        rgbTemp.push([minTemp + value, color])

        colors.push(color)
    }

    const getRGBColor = (temp: number): string => {
        let nearestValue = Number.MAX_VALUE
        let currIndex = 0
        rgbTemp.forEach((el, index) => {
            const deltaPrev = Math.abs(temp - nearestValue)
            const deltaCurr = Math.abs(temp - el[0])
            if (deltaCurr < deltaPrev) {
                nearestValue = el[0]
                currIndex = index
            }
        })

        const rbg = rgbTemp[currIndex][1]

        return rbg
    }

    return {
        indexToTemp,
        rgbTemp,
        colors,
        getRGBColor
    }
}
