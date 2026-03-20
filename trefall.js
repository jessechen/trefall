const TOPPLE_THRESHOLD = 2;

class Coords {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.w})`;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y && this.w === other.w;
    }
}

class TriangularGrid {
    constructor(size, initialValue = 0) {
        this.size = size;
        // The internal representation is a doubled square grid
        this.internal = [];
        for (let i = 0; i < size * 2; i++) {
            this.internal[i] =  new Array(size * 4).fill(initialValue);
        }
    }

    get(coords) {
        if (!this.isInside(coords)) {
            console.error(`Getting ${coords} is not inside!`)
            return 0;
        }
        return this.internal[coords.y][coords.x * 2 + coords.w];
    }

    set(value, coords) {
        if (!this.isInside(coords)) {
            console.error(`Setting ${coords} is not inside!`)
            return 0;
        }
        this.internal[coords.y][coords.x * 2 + coords.w] = value;
    }

    increment(coords) {
        this.set(this.get(coords) + 1, coords);
    }

    add(value, coords) {
        this.set(this.get(coords) + value, coords);
    }

    subtract(value, coords) {
        this.set(this.get(coords) - value, coords);
    }

    isInside(coords) {
        if (!coords) { return false; }
        if (coords.x < 0) { return false; }
        if (coords.x >= this.size * 2) { return false; }
        if (coords.y < 0) { return false; }
        if (coords.y >= this.size * 2) { return false; }
        const q = coords.x + coords.y;
        if (q < this.size - 1) { return false; }
        if (q === this.size - 1) { return !!coords.w; }
        if (q > this.size * 3 - 1) { return false; }
        if (q === this.size * 3 - 1) { return !coords.w; }
        return true;
    }

    allCoords() {
        const result = [];
        for (let j = 0; j < this.size * 2; j++) {
            for (let i = 0; i < this.size * 2; i++) {
                result.push(new Coords(i, j, 0));
                result.push(new Coords(i, j, 1));
            }
        }
        return result.filter((coord) => this.isInside(coord));
    }

    minus(other) {
        this.allCoords().forEach((coord) => this.subtract(other.get(coord), coord));
    }

    neighbors(coords) {
        let result = [];
        if (!this.isInside(coords)) {
            console.error(`Neighborhood of ${coords} is not inside!`)
            return result;
        }
        if (!!coords.w) {
            result = [new Coords(coords.x, coords.y, 0),
                new Coords(coords.x + 1, coords.y, 0),
                new Coords(coords.x, coords.y + 1, 0)];
        } else {
            result = [new Coords(coords.x, coords.y, 1),
                new Coords(coords.x - 1, coords.y, 1),
                new Coords(coords.x, coords.y - 1, 1)];
        }
        return result.filter((coord) => this.isInside(coord));
    }

    step() {
        return this.allCoords()
            .map((coord) => this.topple(coord))
            .some((dirty) => dirty === true);
    }

    topple(coords) {
        if(!this.isInside(coords)) {
            return false;
        }
        const val = (this.get(coords));
        if (val <= TOPPLE_THRESHOLD) {
            return false;
        } else {
            this.set(val - (TOPPLE_THRESHOLD + 1), coords);
            for (let neighbor of this.neighbors(coords)) {
                this.increment(neighbor);
            }
            return true;
        }
    }

    collapse() {
        let iteration = 0;
        while(this.step()) {
            iteration++;
            if (iteration % 100 === 0) {
                console.log(`Iteration #${iteration}`)
            };
        }
    }
}

const identity = function(side) {
    // algorithm is collapse(2 * threshold - collapse(2 * threshold))
    // source: https://fse.studenttheses.ub.rug.nl/21391/1/bMath_2020_DomanN.pdf

    const twicemax = new TriangularGrid(side, 2 * TOPPLE_THRESHOLD);
    const subtrahend = new TriangularGrid(side, 2 * TOPPLE_THRESHOLD);
    subtrahend.collapse();
    twicemax.minus(subtrahend);
    twicemax.collapse();
    return twicemax;
}

const seed = function(amount, side) {
    const grid = new TriangularGrid(side);
    grid.set(amount, new Coords(11, 11, 1));
    grid.collapse();
    return grid;
}

const bounds = function(side) {
    const grid = new TriangularGrid(side);
    for (let coord of grid.allCoords()) {
        grid.set(1, coord);
    }
    return grid;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const up = new Path2D("M11 0L22 19H0Z");
const down = new Path2D("M-11 0H11L0 19Z");
const zero = "#3d5a80";
const one = "#98c1d9";
const two = "#e0fbfc";
let grid;
let playing = true;
let time = performance.now();
let source = new Coords(11, 11, 1);

// Rational estimate for sqrt(3) is 19/11 accurate to about 0.1%
// so side length = 22 and height = 19
// Axis vectors are i = (22, 11) and j = (0, 19)
const drawInitial = function(grid) {
    for (let coord of grid.allCoords()) {
        ctx.save();
        if (coord.equals(source)) {
            ctx.fillStyle = "#f00";
        } else if (grid.get(coord) === 0) {
            ctx.fillStyle = zero;
        } else if (grid.get(coord) === 1) {
            ctx.fillStyle = one;
        } else {
            ctx.fillStyle = two;
        }
        ctx.translate(22 * coord.x + 11 * coord.y, 19 * coord.y);
        ctx.fill(coord.w ? up : down);
        ctx.restore();
    }
}

const tick = function(millis) {
    const delta = millis - time;
    grid.add(Math.ceil(delta / 20), new Coords(11, 11, 1));
    grid.collapse();
    drawInitial(grid);
    time = millis;
    if (playing) {
        requestAnimationFrame((millis) => tick(millis));
    }
}

const handleClick = function(evt) {
    playing = !playing;
    if (playing) {
        time = performance.now();
        requestAnimationFrame((millis) => tick(millis));
    }
}

const handleMove = function(evt) {
    const coords = toGridCoords(evt.offsetX, evt.offsetY);
    if (grid.isInside(coords)) {
        source = coords;
    }
    drawInitial(grid);
}

// Inverse of axis matrix is [[22 0][-38 19]]
// We have to also add 11 to x because the down path shifts everything left 11 pixels
const toGridCoords = function(cursorX, cursorY) {
    const q = ((cursorX + 11) / 22) - (cursorY / 38);
    const r = cursorY / 19;
    const gridX = Math.floor(q);
    const gridY = Math.floor(r);
    const gridW = q - Math.floor(q) + r - Math.floor(r) < 1 ? 0 : 1;
    return new Coords(gridX, gridY, gridW);
}

document.addEventListener("click", handleClick);
canvas.addEventListener("mousemove", handleMove);
grid = bounds(12);
drawInitial(grid);
requestAnimationFrame((millis) => tick(millis));
