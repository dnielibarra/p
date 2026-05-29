const introText = document.getElementById("introText");
const intro = document.getElementById("intro");
const romInput = document.getElementById("romInput");
const romName = document.getElementById("romName");
const romMenu = document.getElementById("romMenu");

setTimeout(() => introText.textContent = "LOADING CORE...", 900);
setTimeout(() => introText.textContent = "READY", 1800);

setTimeout(() => {
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.remove();
  }, 1000);

}, 2600);

romInput.addEventListener("change", function(e){

  const file = e.target.files[0];

  if(!file) return;

  romName.textContent = file.name;

  const gameUrl = URL.createObjectURL(file);

  romMenu.style.display = "none";

  startEmulator(gameUrl);
});

function startEmulator(gameUrl){

  document.getElementById("game").innerHTML = "";

  window.EJS_player = "#game";
  window.EJS_core = "snes";
  window.EJS_gameUrl = gameUrl;
  window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
  window.EJS_startOnLoaded = true;
  window.EJS_volume = 0.8;
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
