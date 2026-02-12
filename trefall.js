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
    constructor(side) {
        this.side = side;
        this.internal = [];
        for (let i = 0; i < side * 2; i++) {
            this.internal[i] =  new Array(side * 4).fill(0);
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

    isInside(coords) {
        const q = coords.x + coords.y;
        if (q < this.side - 1) { return false; }
        if (q === this.side - 1) { return !!coords.w; }
        if (q > this.side * 3 - 1) { return false; }
        if (q === this.side * 3 - 1) { return !coords.w; }
        return true;
    }

    neighbors(coords) {
        const result = [];
        if (!this.isInside(coords)) {
            console.error(`Neighborhood of ${coords} is not inside!`)
            return result;
        }
        if (!!coords.w) {
            if (this.isInside(new Coords(coords.x, coords.y, 0))) { result.push(new Coords(coords.x, coords.y, 0)); }
            if (this.isInside(new Coords(coords.x + 1, coords.y, 0))) { result.push(new Coords(coords.x + 1, coords.y, 0)); }
            if (this.isInside(new Coords(coords.x, coords.y + 1, 0))) { result.push(new Coords(coords.x, coords.y + 1, 0)); }
        } else {
            if (this.isInside(new Coords(coords.x, coords.y, 1))) { result.push(new Coords(coords.x, coords.y, 1)); }
            if (this.isInside(new Coords(coords.x - 1, coords.y, 1))) { result.push(new Coords(coords.x - 1, coords.y, 1)); }
            if (this.isInside(new Coords(coords.x, coords.y - 1, 1))) { result.push(new Coords(coords.x, coords.y - 1, 1)); }
        }
        return result;
    }

    step() {
        let dirty = false;
        for (let j = 0; j < this.side * 2; j++) {
            for (let i = 0; i < this.side * 2; i++) {
                dirty ||= this.topple(new Coords(i, j, 0));
                dirty ||= this.topple(new Coords(i, j, 1));
            }
        }
        return dirty;
    }

    topple(coords) {
        if(!this.isInside(coords)) {
            return false;
        }
        const val = (this.get(coords));
        if (val <= 3) {
            return false;
        } else {
            this.set(val - 3, coords);
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
            console.log(`iteration #${iteration}`);
        }
    }
}

const grid = new Grid(3);
grid.set(4, new Coords(2, 0, 1));
grid.collapse();
console.log(grid.internal[0]);
