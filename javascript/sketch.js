const mag1 = 5000;
const mag2 = 5000;
const mag3 = 40;
const mag4 = 5;

function setup() {
    // drawing
    const width = 600;
    const height = 800;
    let mag = 500;
    let fact = parseInt(results.length / width);
    temp = [];
    for (let i = 0; i < width; i++) {
        temp.push([i, -results[i * fact][8] * mag1, -results[i * fact][1] * mag2, -results[i * fact][3] * mag3, -results[i * fact][7] * mag4]);
    }
    createCanvas(width, height);
    background(51);

    stroke(255);
    strokeWeight(1);
    noFill();

    let trans = 0;

    translate(0, height / ((temp[0].length - 1) / 0.5));
    trans += height / ((temp[0].length - 1) / 2);
    for (let i = 0; i < temp[0].length - 1; i++) {
        beginShape();
        line(0, width);
        for (let j = 0; j < temp.length; j++) {
            vertex(temp[j][0], temp[j][i + 1]);
        }
        endShape();
        translate(0, height / (temp[0].length - 1));
        trans += height / (temp[0].length - 1);
    }

    console.log("done!");
}

function mousePressed() {
    console.log("saving!");
    save(results, "results.csv", "csv")
}
