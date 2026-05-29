const introText = document.getElementById("introText");
const intro = document.getElementById("intro");
const romInput = document.getElementById("romInput");
const romName = document.getElementById("romName");
const romMenu = document.getElementById("romMenu");
const fullscreenBtn = document.getElementById("fullscreenBtn");

setTimeout(() => {
  introText.textContent = "LOADING CORE...";
}, 900);

setTimeout(() => {
  introText.textContent = "READY";
}, 1800);

setTimeout(() => {
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.remove();
  }, 1000);

}, 2600);

fullscreenBtn.addEventListener("click", async () => {
  try{
    if(!document.fullscreenElement){
      await document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = "×";
    }else{
      await document.exitFullscreen();
      fullscreenBtn.textContent = "⛶";
    }
  }catch(error){
    alert("No se pudo activar pantalla completa");
  }
});

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

  /*
    Esta ruta debe apuntar a la CARPETA data/
    No al archivo loader.js
  */
  window.EJS_pathtodata =
  "https://dnielibarra.github.io/p/emulador/emulatorjs/data/";

  window.EJS_startOnLoaded = true;
  window.EJS_volume = 0.6;
  window.EJS_language = "es";

  const oldLoader = document.getElementById("ejs-loader");

  if(oldLoader){
    oldLoader.remove();
  }

  const script = document.createElement("script");

  script.id = "ejs-loader";

  /*
    Esta ruta sí apunta directamente al archivo loader.js
  */
  script.src =
  "https://dnielibarra.github.io/p/emulador/emulatorjs/data/loader.js";

  document.body.appendChild(script);
}
