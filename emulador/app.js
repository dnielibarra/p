const romInput = document.getElementById("romInput");
const romName = document.getElementById("romName");
const introText = document.getElementById("introText");

setTimeout(() => introText.textContent = "LOADING CORE...", 900);
setTimeout(() => introText.textContent = "READY", 1800);

setTimeout(() => {
  const intro = document.getElementById("intro");
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.remove();
  }, 1000);

}, 2600);

document.getElementById("fullscreenBtn").addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

romInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  romName.textContent = file.name;

  const gameUrl = URL.createObjectURL(file);

  startEmulator(gameUrl);
});

function startEmulator(gameUrl){

  document.getElementById("game").innerHTML = "";

  window.EJS_player = "#game";
  window.EJS_core = "snes";
  window.EJS_gameUrl = gameUrl;
  window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
  window.EJS_startOnLoaded = true;
  window.EJS_volume = 0.7;
  window.EJS_language = "es";

  const oldLoader = document.getElementById("ejs-loader");

  if(oldLoader){
    oldLoader.remove();
  }

  const script = document.createElement("script");
  script.id = "ejs-loader";
  script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";

  document.body.appendChild(script);
}

/* Botones táctiles simulando teclado */

document.querySelectorAll("[data-key]").forEach(button => {

  const keyCode = button.dataset.key;

  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    pressKey(keyCode);
    vibrate();
  });

  button.addEventListener("touchend", (e) => {
    e.preventDefault();
    releaseKey(keyCode);
  });

  button.addEventListener("mousedown", (e) => {
    e.preventDefault();
    pressKey(keyCode);
  });

  button.addEventListener("mouseup", (e) => {
    e.preventDefault();
    releaseKey(keyCode);
  });

  button.addEventListener("mouseleave", () => {
    releaseKey(keyCode);
  });

});

function pressKey(code){
  document.dispatchEvent(new KeyboardEvent("keydown", {
    code: code,
    key: code,
    bubbles: true
  }));
}

function releaseKey(code){
  document.dispatchEvent(new KeyboardEvent("keyup", {
    code: code,
    key: code,
    bubbles: true
  }));
}

function vibrate(){
  if(navigator.vibrate){
    navigator.vibrate(18);
  }
}
