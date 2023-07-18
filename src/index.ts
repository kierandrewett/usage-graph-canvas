import "./components/graph";
import { Graph } from "./components/graph";
import { html } from "./html";

const main = () => {
    console.log("init", customElements.get("browser-graph"))

    const mount = document.getElementById("app");

    const graph = html("browser-graph", {}) as Graph;
    globalThis.graph = graph;

    const text = html("span", {}) as HTMLSpanElement;

    mount?.appendChild(graph);
    mount?.appendChild(text);

    // this determines how fast the graph is
    // in order to maintain our scale 0s, 10s, 20s
    // we only want to query new points and add them
    // every 1000 ms (1 second)
    const RATE = 1000;

    setInterval(() => {
        const y = Math.floor(Math.random() * 101);

        graph.addPoint(100 - y);
        text.textContent = `${y}%`;
    }, RATE);
}

window.addEventListener("DOMContentLoaded", main, { once: true });