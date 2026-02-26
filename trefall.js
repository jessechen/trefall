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
}

class Grid {
    constructor(side, initialValue = 0) {
        this.side = side;
        this.internal = [];
        for (let i = 0; i < side * 2; i++) {
            this.internal[i] =  new Array(side * 4).fill(initialValue);
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

    subtract(value, coords) {
        this.set(this.get(coords) - value, coords);
    }

    isInside(coords) {
        if (coords.x < 0) { return false; }
        if (coords.x >= this.side * 2) { return false; }
        if (coords.y < 0) { return false; }
        if (coords.y >= this.side * 2) { return false; }
        const q = coords.x + coords.y;
        if (q < this.side - 1) { return false; }
        if (q === this.side - 1) { return !!coords.w; }
        if (q > this.side * 3 - 1) { return false; }
        if (q === this.side * 3 - 1) { return !coords.w; }
        return true;
    }

    allCoords() {
        const result = [];
        for (let j = 0; j < this.side * 2; j++) {
            for (let i = 0; i < this.side * 2; i++) {
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
        return this.allCoords().some((coord) => this.topple(coord));
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

const seed = function(amount, side) {
    const grid = new Grid(side);
    grid.set(amount, new Coords(2, 2, 1));
    grid.collapse();
    return grid;
}

const result = seed(200, 3);
console.log(result.internal[0]);
console.log(result.internal[1]);
console.log(result.internal[2]);
console.log(result.internal[3]);
console.log(result.internal[4]);
console.log(result.internal[5]);
