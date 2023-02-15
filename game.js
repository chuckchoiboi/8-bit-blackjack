import { renderStartScreen } from "./screen.js";

const init = () => {
    let stage = new createjs.Stage("gameCanvas");
    renderStartScreen(stage)
}

document.addEventListener("DOMContentLoaded", init)