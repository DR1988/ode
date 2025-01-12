const Nx = 20; // number of divisions in x coordinate
const Ny = 20; // number of divisions in y coordinate
const xn = 0.0; // initial point x
const xk = 0.1; // final point x
const yn = 0.0; // initial point y
const yk = 0.1; // final point y
const c_t = 700.0; // heat capacity of material
const ro_t = 7500.0; // density of material
const lm_t = 30.0; // thermal conductivity of material
const time_k = 1000.0; // final calculation time
const Tb = 300.0; // initial temperature
const Txl = 300.0; // temperature at the left boundary
const Txp = 1000.0; // temperature at the right boundary
const dt = 1e-3; // time step

function qi(time) {
    // Placeholder for the qi function, implement as needed
    return 0.0; // Example implementation
}

export function test() {
    let T = Array.from({ length: Nx + 1 }, () => Array(Ny + 1).fill(0));
    let TET = Array.from({ length: Nx + 1 }, () => Array(Ny + 1).fill(0));
    let hx, hy, kappa, dh, A, B, C, F, kur_y, kur_x;
    let time = 0.0, Qi, dt_k = dt;
    let tk, k, kp;

    hx = (xk - xn) / Nx; // spatial step in x direction
    hy = (yk - yn) / Ny; // spatial step in y direction
    kappa = lm_t / (c_t * ro_t);
    kur_x = dt * kappa / (hx * hx);
    kur_y = dt * kappa / (hy * hy);
    tk = time_k / dt; // number of time steps
    kp = 1e4; // output interval

    // Initial data block
    for (let i = 1; i <= Nx; i++) {
        for (let j = 1; j <= Ny; j++) {
            T[i][j] = Tb;
        }
    }

    // Main loop
    for (k = 1; k <= tk; k++) {
        time += dt;

        // Temperature calculation in x direction
        for (let j = 2; j <= Ny; j++) {
            let alx = Array(Nx + 1).fill(0);
            let betx = Array(Nx + 1).fill(0);
            alx[1] = 0; // Boundary condition at T(0, y)
            betx[1] = Txl; // Boundary condition at T(0, y)
            A = -kur_x / 2.0;
            B = 1.0 + kur_x;
            C = -kur_x / 2.0;

            for (let i = 2; i <= Nx; i++) {
                Qi = qi(time);
                F = T[i][j] + kur_y * (T[i][j + 1] - 2.0 * T[i][j] + T[i][j - 1]) / 2.0 + Qi * dt / 2.0;
                alx[i] = -C / (B + A * alx[i - 1]);
                betx[i] = (F - A * betx[i - 1]) / (B + A * alx[i - 1]);
            }

            TET[Nx][j] = Txp; // Boundary condition at T(Lx, y)

            // TET - auxiliary temperature, corresponds to temperature with "dash"
            for (let i = Nx; i >= 1; i--) {
                const v = TET[i][j]
                TET[i][j] = v * alx[i] + betx[i];
            }
        }

        // Completing the calculation in the x direction with boundary temperature values at upper (y=yk) and lower (y=yn) boundaries
        for (let i = 1; i <= Nx; i++) {
            TET[i][1] = TET[i][2]; // boundary condition for T(x, 0)
            TET[i][Ny] = TET[i][Ny]; // boundary condition for T(x, Ly)
        }

        // Temperature calculation in y direction
        for (let i = 2; i <= Nx; i++) {
            let aly = Array(Ny + 1).fill(0);
            let bety = Array(Ny + 1).fill(0);
            aly[1] = 1; // Boundary condition at T(x, 0)
            bety[1] = 0; // Boundary condition at T(x, 0)
            A = -kur_y / 2.0;
            B = 1.0 + kur_y;
            C = -kur_y / 2.0;

            for (let j = 2; j <= Ny; j++) {
                Qi = qi(time);
                F = TET[i][j] + kur_y * (TET[i][j] - 2.0 * TET[i][j] + TET[i - 1][j]) / 2.0 + Qi * dt / 2.0;
                aly[j] = -C / (B + A * aly[j - 1]);
                bety[j] = (F - A * bety[j - 1]) / (B + A * aly[j - 1]);
            }
            T[i][Ny + 1] = bety[Ny] / (1 - aly[Ny]); // Boundary condition at T(x, Ly)

            for (let j = Ny; j >= 1; j--) {
                T[i][j] = T[i][j + 1] * aly[j] + bety[j];
            }
        }

        // Completing the calculation in the y direction with boundary temperature values at left (x=xn) and right (x=xk) boundaries
        for (let j = 1; j <= Ny + 1; j++) {
            T[1][j] = Txl; // boundary condition for T(0, y)
            T[Nx][j] = Txp; // boundary condition for T(Lx, y)
        }
    }

    console.log('tt', T);
    
}

