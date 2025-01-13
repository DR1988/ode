export const test = () => {
    const mf = 30;
    type Vector1 = number[];
    type Vector2 = number[][];
    let i: number, j: number, Nx: number, Ny: number;
    let T: Vector2 = Array.from({ length: mf }, () => Array(mf).fill(0));
    let alfa: Vector1 = Array(mf).fill(0);
    let beta: Vector1 = Array(mf).fill(0);
    let ai: number, bi: number, ci: number, fi: number;
    let a: number, lamda: number, ro: number, c: number;
    let hx: number, hy: number, tau: number, t_end: number, time: number;
    let T0: number, L: number, H: number, Th: number, Tc: number;

    Nx = 30;
    Ny = 30;
    lamda = 390;
    c = 385;
    ro = 8960;
    t_end = 60;
    L = 0.5;
    H = 0.5;
    Th = 80;
    Tc = 30;
    T0 = 5;

    const timeSteps = 100
    hx = L / (Nx - 1);
    hy = H / (Ny - 1);
    a = lamda / (ro * c);
    tau = t_end / timeSteps;

    const xArray = Array.from(new Array(Nx)).map(i => 0)
    const yArray = Array.from(new Array(Ny)).map(i => 0)
    const T2D: number[][][] = Array.from(new Array(timeSteps))
        .map(_ => [...xArray].map(_ => [...yArray]))


    for (let t = 0; t < timeSteps; t++) {
        for (i = 0; i < Nx; i++) {
            for (j = 0; j < Ny; j++) {
                T2D[t][i][j] = T0;
                T[i][j] = T0
            }
        }
    }

    for (let t = 0; t < timeSteps; t++) {
        for (let j = 0; j < Ny; j++) {
            T2D[t][0][j] = Th;
            T[0][j] = Th
            // Temp2D[t][Nx / 2][j] = Thfunc(j)
            // Temp2D[t][Nx - 1][j] = Tc;
        }
    }


    time = 0;
    while (time < timeSteps - 1) {
        time++;

        for (j = 0; j < Ny; j++) {
            alfa[0] = 0.0;
            beta[0] = Th;

            for (i = 1; i < Nx; i++) {
                ai = lamda / (hx * hx);
                bi = 2.0 * lamda / (hx * hx) + ro * c / tau;
                ci = lamda / (hx * hx);
                fi = -ro * c * T2D[time - 1][i][j] / tau;

                alfa[i] = ai / (bi - ci * alfa[i - 1]);
                beta[i] = (ci * beta[i - 1] - fi) / (bi - ci * alfa[i - 1]);
            }

            T2D[time][Nx - 1][j] = Tc;

            for (i = Nx - 2; i > 0; i--) {
                T2D[time][i][j] = alfa[i] * T2D[time][i + 1][j] + beta[i];
            }
        }

        for (i = 1; i < Nx - 2; i++) {
            alfa[0] = 2.0 * a * tau / (2.0 * a * tau + (hy * hy));
            beta[0] = (hy * hy) * T2D[time][i][0] / (2.0 * a * tau + (hy * hy));

            for (j = 1; j <= Ny - 1; j++) {
                ai = lamda / (hy * hy);
                bi = 2.0 * lamda / (hy * hy) + ro * c / tau;
                ci = lamda / (hy * hy);
                fi = -ro * c * T2D[time][i][j] / tau;

                alfa[j] = ai / (bi - ci * alfa[j - 1]);
                beta[j] = (ci * beta[j - 1] - fi) / (bi - ci * alfa[j - 1]);
            }

            T2D[time][i][Ny - 1] = (2.0 * a * tau * beta[Ny - 2] + (hy * hy) * T2D[time][i][Ny - 1]) / (2.0 * a * tau * (1.0 - alfa[Ny - 2]) + (hy * hy));

            for (j = Ny - 2; j > 0; j--) {
                T2D[time][i][j] = alfa[j] * T2D[time][i][j + 1] + beta[j];
            }
        }
    }

    console.log('TTT', T2D);

}