import { html } from "../html";
import "./graph.css";

export class Graph extends HTMLElement {
    constructor() {
        super();
    }

    resizeObserver: ResizeObserver; 

    get canvas() {
        return this.querySelector("div > canvas")! as HTMLCanvasElement;
    }

    get ctx() {
        return this.canvas.getContext("2d")!;
    }

    get axes() {
        return {
            x: this.querySelector(".graph-x-axis"),
            y: this.querySelector(".graph-y-axis"),
        }
    }
    
    x = 0

    get pointGap() {
        const timings = this.axes.x?.querySelector("ul")!;

        if (!timings) return 0;

        const zeroSeconds = timings.lastChild as HTMLLIElement;
        const tenSeconds = timings.children[timings.children.length - 2];

        const zeroSecondX = zeroSeconds.getBoundingClientRect().x - zeroSeconds.getBoundingClientRect().width;
        const tenSecondX = tenSeconds.getBoundingClientRect().x - tenSeconds.getBoundingClientRect().width;

        const diff = zeroSecondX - tenSecondX;
        const lowerBoundDiff = diff / 10; // gives us a single second

        return lowerBoundDiff;
    }

    observeResize: ResizeObserverCallback = (entries) => {
        const entry = entries[0];

        this.canvas.width = entry.contentRect.width;
        this.canvas.height = entry.contentRect.height;
    }

    paint() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black"

        const calcX = (point: number) => this.canvas.width - (point * this.pointGap);
        const calcY = (point: number) => (this.canvas.height / 100) * point

        for (var i = 1; i < this.canvas.width; i++) {
            const point = this.points.slice().reverse()[i];
            const previousPoint = this.points.slice().reverse()[i - 1];

            if (point && !isNaN(point)) {
                const x = calcX(i);
                const y = calcY(point);

                if (x < (0 - this.pointGap)) {
                    const clone = this.points.slice().reverse();
                    const actualIndex = i;
                    clone[actualIndex] = NaN;
                    this.points = clone.reverse();
                }

                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
                
                if (previousPoint) {
                    const prevX = calcX(i - 1);
                    const prevY = calcY(previousPoint);

                    this.ctx.beginPath();
                    this.ctx.moveTo(prevX, prevY);
                    this.ctx.lineTo(x, y);
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        }
    }

    points: number[] = [];

    addPoint(y: number) {
        if (y > 100) {
            throw new Error("Point should be between 0 and 100 on the y axis");
        }

        this.points.push(Math.max(y, 1));
    }

    get debug() {
        return this.hasAttribute("debug");
    }

    connectedCallback() {
        const yAxis = html("div", { class: "graph-y-axis" }, 
            html("div", { class: "graph-canvas-container" },
                html("canvas", {})
            ),
            html("ul", {}, 
                html("li", {}, "100%"),
                html("li", {}, "80%"),
                html("li", {}, "60%"),
                html("li", {}, "40%"),
                html("li", {}, "20%"),
                html("li", {}, "0%"),
            )
        );

        const xAxis = html("div", { class: "graph-x-axis" },
            html("ul", {}, 
                html("li", {}, "1m"),
                html("li", {}, "50s"),
                html("li", {}, "40s"),
                html("li", {}, "30s"),
                html("li", {}, "20s"),
                html("li", {}, "10s"),
                html("li", {}, "0s"),
            )
        );

        this.appendChild(yAxis);
        this.appendChild(xAxis);

        this.resizeObserver = new ResizeObserver(this.observeResize)
        this.resizeObserver.observe(this.canvas.parentElement!);

        this.ctx.translate(0.5, 0.5);

        setInterval(() => {
            this.paint();
        }, 100);

        requestAnimationFrame(this.paint.bind(this));

        const yWidth = this.axes.y?.querySelector("ul")?.getBoundingClientRect().width;
        this.axes.x?.querySelector("ul")?.style.setProperty("--y-width", yWidth + "px");
    }
}

customElements.define("browser-graph", Graph);