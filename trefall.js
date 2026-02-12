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
        return this.internal[y][x * 2 + w];
    }

    set(value, coords) {
        if (!this.isInside(coords)) {
            console.error(`Setting ${coords} is not inside!`)
            return 0;
        }
        this.internal[coords.y][coords.x * 2 + coords.w] = value;
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
}

const grid = new Grid(3);
console.log(grid.neighbors(new Coords(2, 0, 1)));
