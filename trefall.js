class Grid {
    constructor(side) {
        this.side = side;
        this.internal = [];
        for (let i = 0; i < side * 2; i++) {
            this.internal[i] =  new Array(side * 4).fill(0);
        }
    }

    get(x, y, w) {
        return this.internal[y][x * 2 + w];
    }

    set(value, x, y, w) {
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
}

const grid = new Grid(3);
grid.set(5, 2, 0, 0);
grid.set(4, 2, 0, 1);
console.log(grid.internal[0]);
console.log(grid.isInside(2, 0, 0));
console.log(grid.isInside(2, 0, 1));
