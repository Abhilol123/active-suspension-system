const control = "NN";
const delta_t = 0.001;
let nn = new NN(nn_trained.no_inp_nodes, nn_trained.no_ans_nodes, nn_trained.no_hidden_layers, nn_trained.no_hidden_nodes);
nn.initialise();

for (let i = 0; i < nn_trained.bias.length; i++) {
    nn.bias[i] = Matrix.fromArray(Matrix.toArray(nn_trained.bias[i]));
}
for (let i = 0; i < nn_trained.weights.length; i++) {
    nn.weights[i] = Matrix.fromArray(Matrix.toArray(nn_trained.weights[i]));
}

let xValues = [];

const Ms = 2.45;
const Mus = 1.00;
const Ks = 900;
const Kus = 2500;
const Bs = 7.50;
const Bus = 5.00;
const g = 9.80665;

const A = Matrix.fromArray([[0, 1, 0, -1], [-Ks / Ms, -Bs / Ms, 0, Bs / Ms], [0, 0, 0, 1], [Ks / Mus, Bs / Mus, -Kus / Mus, -(Bs + Bus) / Mus]]);
const B = Matrix.fromArray([[0, 0], [0, 1 / Ms], [-1, 0], [Bus / Mus, -1 / Mus]]);
const C = Matrix.fromArray([[1, 0, 0, 0], [-Ks / Ms, -Bs / Ms, 0, Bs / Ms]]);
const D = Matrix.fromArray([[0, 0], [0, 1 / Ms]]);

// x1 = 0;
// x2 = 0;
// zus = x1 + g * (Ms + Mus) / Kus;
// zs = x2 + g * (Ms / Ks + (Ms + Mus) / Kus);

let Fc = 0;

let zs = 0;
let zus = 0;
let zr = 0;

let zs_dot = 0;
let zus_dot = 0;
let zr_dot = 0;

let zs_dot_dot = 0;
let zus_dot_dot = 0;
let zr_dot_dot = 0;

let x = Matrix.fromArray([[zs - zus], [zs_dot], [zus - zr], [zus_dot]]);
let x_dot = Matrix.fromArray([[zs_dot - zus_dot], [zs_dot_dot], [zus_dot - zr_dot], [zus_dot_dot]])
let u = Matrix.fromArray([[zr_dot], [Fc]]);
let y = Matrix.fromArray([[zs - zus], [zs_dot_dot]]);

let t = 0;

let results = [];
results.push(["t", "zs", "zs_dot", "zs_dot_dot", "zus", "zus_dot", "zus_dot_dot", "Fc", "zr"]);
let graph = [];

let K = Matrix.fromArray([[0, 0, 0, 0], [18.24, 48.43, -14.47, 5.66]]);

let calculate = true;
let index = 0;
while (calculate) {
    let old_zs = zs;
    let old_zus = zus;

    let old_zs_dot = zs_dot;
    let old_zus_dot = zus_dot;

    let old_zr = zr;
    let old_zr_dot = zr_dot;

    zr = road_input[index];
    zr_dot = (zr - old_zr) / delta_t;
    index = index + 1;

    if (control == "LQR") {
        u = Matrix.multiply(K, x);
        u.multiply(-1);
        Fc = u.data[1][0];
        if (Fc > 20) {
            Fc = 20;
            u.data[1][0] = 20;
        }
        if (Fc < -20) {
            Fc = -20;
            u.data[1][0] = -20;
        }
    }

    if (control === "NN") {
        Fc = (nn.forwardPropagation(x).data[0][0] - 0.5) * 200;
        if (Fc > 20) {
            Fc = 20;
        }
        if (Fc < -20) {
            Fc = -20;
        }
    }

    x_dot = Matrix.add(Matrix.multiply(A, x), Matrix.multiply(B, u));
    y = Matrix.add(Matrix.multiply(C, x), Matrix.multiply(D, u));

    zs_dot_dot = x_dot.data[1][0];
    zus_dot_dot = x_dot.data[3][0];

    zs_dot = zs_dot_dot * delta_t + old_zs_dot;
    zs = zs_dot * delta_t + old_zs;

    zus_dot = zus_dot_dot * delta_t + old_zus_dot;
    zus = zus_dot * delta_t + old_zus;

    x.data[0][0] = zs - zus;
    x.data[1][0] = zs_dot;
    x.data[2][0] = zus - zr;
    x.data[3][0] = zus_dot;

    u.data[0][0] = zr_dot;
    u.data[1][0] = Fc;

    temp = [t, zs, zs_dot, zs_dot_dot, zus, zus_dot, zus_dot_dot, Fc, zr];
    results.push(temp);
    xValues.push([[x.data[0][0], x.data[1][0], x.data[2][0], x.data[3][0]], [Fc]]);

    if (index >= road_input.length) {
        console.log("completed!");
        calculate = false;
    }
    t = t + delta_t;
}
