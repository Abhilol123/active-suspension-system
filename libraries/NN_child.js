function randomise(number)  {
    let solution = number;
    let rate = 0.01;
    if (Math.random() < rate)  {
        solution = solution + (Math.random() * 2 - 1) * 0.01
    }
    return solution;
}

class NN_child {
    constructor(no_inp_nodes, no_ans_nodes, no_hidden_layers, no_hidden_nodes, weights, bias) {
        this.no_inp_nodes = no_inp_nodes;
        this.no_ans_nodes = no_ans_nodes;
        this.no_hidden_layers = no_hidden_layers;
        this.no_hidden_nodes = no_hidden_nodes;

        this.weights = weights;
        this.bias = bias;

        this.forw_prop;
    }

    predict(inputs_matrix)   {
        this.forw_prop = [inputs_matrix];
        for (let i = 0; i < this.bias.length; i++)  {
            this.forw_prop.push(Matrix.multiply(this.weights[i], this.forw_prop[i]))
            this.forw_prop[i+1] = Matrix.add(this.forw_prop[i+1], this.bias[i])
            this.forw_prop[i+1].map(Matrix.sigmoid)
        }
        let pred = this.forw_prop[this.forw_prop.length - 1]
        return pred
    }

    mutate()    {
        for (let i = 0; i < this.weights.length; i++){
            this.weights[i].map(randomise)
        }
        for (let i = 0; i < this.bias.length; i++){
            this.bias[i].map(randomise)
        }
    }

    static createChild(brian)   {
        let weights = []
        let bias = []
        for (let i = 0; i < brian.weights.length; i++)  {
            let temp1 = new Matrix(brian.weights[i].rows, brian.weights[i].cols)
            for (let k = 0; k < temp1.rows; k++) {
                temp1.data[k] = [];
                for (let j = 0; j < temp1.cols; j++) {
                    temp1.data[k][j] = brian.weights[i].data[k][j];
                }
            }
            weights.push(temp1)
        }
        for (let i = 0; i < brian.bias.length; i++)  {
            let temp1 = new Matrix(brian.bias[i].rows, brian.bias[i].cols)
            for (let k = 0; k < temp1.rows; k++) {
                temp1.data[k] = [];
                for (let j = 0; j < temp1.cols; j++) {
                    temp1.data[k][j] = brian.bias[i].data[k][j];
                }
            }
            bias.push(temp1)
        }
        let child = new NN_child(brian.no_inp_nodes, brian.no_ans_nodes, brian.no_hidden_layers, brian.no_hidden_nodes, weights, bias);
        return child
    }
}
