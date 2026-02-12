class Grid {
    constructor(side) {
        this.side = side;
        this.internal = [];
        for (let i = 0; i < side * 2; i++) {
            this.internal[i] =  new Array(side * 4).fill(0);
        }
    }

    get(x, y, w) {
        if (!this.isInside(x, y, w)) {
            console.error(`Getting (${x}, ${y}, ${w}) is not inside!`)
            return 0;
        }
        return this.internal[y][x * 2 + w];
    }

    set(value, x, y, w) {
        if (!this.isInside(x, y, w)) {
            console.error(`Setting (${x}, ${y}, ${w}) is not inside!`)
            return 0;
        }
        this.internal[y][x * 2 + w] = value;
    }

    isInside(x, y, w) {
        const q = x + y;
        if (q < this.side - 1) { return false; }
        if (q === this.side - 1) { return !!w; }
        if (q > this.side * 3 - 1) { return false; }
        if (q === this.side * 3 - 1) { return !w; }
        return true;
    }

    neighbors(x, y, w) {
        const result = [];
        if (!this.isInside(x, y, w)) {
            console.error(`Neighborhood of (${x}, ${y}, ${w}) is not inside!`)
            return result;
        }
        if (!!w) {
            if (this.isInside(x, y, 0)) { result.push(x, y, 0); }
            if (this.isInside(x + 1, y, 0)) { result.push(x + 1, y, 0); }
            if (this.isInside(x, y + 1, 0)) { result.push(x, y + 1, 0); }
        } else {
            if (this.isInside(x, y, 1)) { result.push(x, y, 1); }
            if (this.isInside(x - 1, y, 1)) { result.push(x - 1, y, 1); }
            if (this.isInside(x, y - 1, 1)) { result.push(x, y - 1, 1); }
        }
        return result;
    }
}

const grid = new Grid(3);
console.log(grid.neighbors(2, 0, 1));
