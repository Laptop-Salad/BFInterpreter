import BFInterpreter from "./interpreter.js";

const codearea = document.getElementById("codearea");

codearea.addEventListener("click", function () {
    codearea.classList.add("codearea-anim");
})

codearea.addEventListener("mouseleave", function () {
    codearea.classList.remove("codearea-anim");
})

// Run
const run = document.getElementById("run");
const result = document.getElementById("result");

run.addEventListener("click", function () {
    result.innerHTML = "";
    new BFInterpreter(codearea.value);
})

// Clear
const clear = document.getElementById("clear");

clear.addEventListener("click", function () {
    result.innerHTML = "";
    codearea.value = ""
})