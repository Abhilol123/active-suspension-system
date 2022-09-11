class Population    {
    constructor(total, _old)   {
        this.total = total;
        this.old = _old;
    }

    pickOne()  {
        let index = 0;
        let r = random();
        while(r > 0)    {
            r = r - this.old[index].fitness;
            index++;
        }
        index--;
        let bi = this.old[index];
        let child = new birdAI(bi.brain)
        if (Math.random() < 0.8) {
            child.brain.mutate();
        }
        return child;
    }

    calFit()   {
        let sum = 0;
        for (let i = 0; i < this.total; i++)   {
            sum = sum + this.old[i].score;
        }
        for (let i = 0; i < this.total; i++) {
            this.old[i].fitness = this.old[i].score/sum;
        }
    }

    nextGen()  {

        this.calFit()

        let b = []

        for (let i = 0; i < total*0.20; i++) {
            b.push(this.pickOne());
        }

        let n = [];
        let brain = [];

        for (let i = 0; i < total*0.80; i++) {
            n.push(new NN(4, 2, 1, [8]));
            brain.push(NN_child.createChild(n[i]));
            b.push(new birdAI(brain[i]));
        }

        for (let i = 0; i < total; i++) {
            b[i].label = generation;
        }
        return b;
    }
}
