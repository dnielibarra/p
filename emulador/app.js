const introText = document.getElementById("introText");
const intro = document.getElementById("intro");
const romInput = document.getElementById("romInput");
const romName = document.getElementById("romName");
const romMenu = document.getElementById("romMenu");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let fullscreenMoved = false;
let draggingFullscreen = false;
let offsetX = 0;
let offsetY = 0;

/* INTRO */

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

/* FULLSCREEN */

async function toggleFullscreen(){
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
}

fullscreenBtn.addEventListener("click", () => {
  if(fullscreenMoved){
    fullscreenMoved = false;
    return;
  }

  toggleFullscreen();
});

/* BOTON FULLSCREEN MOVIBLE CON DEDO */

fullscreenBtn.addEventListener("touchstart", function(e){
  const touch = e.touches[0];
  const rect = fullscreenBtn.getBoundingClientRect();

  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  draggingFullscreen = false;
}, {passive:false});

fullscreenBtn.addEventListener("touchmove", function(e){
  e.preventDefault();

  const touch = e.touches[0];

  let newLeft = touch.clientX - offsetX;
  let newTop = touch.clientY - offsetY;

  const maxLeft = window.innerWidth - fullscreenBtn.offsetWidth;
  const maxTop = window.innerHeight - fullscreenBtn.offsetHeight;

  newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  newTop = Math.max(0, Math.min(newTop, maxTop));

  fullscreenBtn.style.left = newLeft + "px";
  fullscreenBtn.style.top = newTop + "px";
  fullscreenBtn.style.right = "auto";

  draggingFullscreen = true;
  fullscreenMoved = true;
}, {passive:false});

fullscreenBtn.addEventListener("touchend", function(e){
  if(draggingFullscreen){
    e.preventDefault();
  }
}, {passive:false});

/* SOPORTE MOUSE PARA PC */

fullscreenBtn.addEventListener("mousedown", function(e){
  offsetX = e.clientX - fullscreenBtn.getBoundingClientRect().left;
  offsetY = e.clientY - fullscreenBtn.getBoundingClientRect().top;

  draggingFullscreen = false;

  function move(ev){
    let newLeft = ev.clientX - offsetX;
    let newTop = ev.clientY - offsetY;

    const maxLeft = window.innerWidth - fullscreenBtn.offsetWidth;
    const maxTop = window.innerHeight - fullscreenBtn.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    fullscreenBtn.style.left = newLeft + "px";
    fullscreenBtn.style.top = newTop + "px";
    fullscreenBtn.style.right = "auto";

    draggingFullscreen = true;
    fullscreenMoved = true;
  }

  function up(){
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
});

/* CARGAR ROM */

romInput.addEventListener("change", function(e){

  const file = e.target.files[0];

  if(!file) return;

  romName.textContent = file.name;

  const gameUrl = URL.createObjectURL(file);

  romMenu.style.display = "none";

  startEmulator(gameUrl);
});

/* EMULATORJS */

function startEmulator(gameUrl){

  document.getElementById("game").innerHTML = "";

  window.EJS_player = "#game";
  window.EJS_core = "snes";
  window.EJS_gameUrl = gameUrl;

  /*
    Esta ruta apunta a la carpeta data/
    Debe terminar con /
  */
  window.EJS_pathtodata =
  "https://dnielibarra.github.io/p/emulador/emulatorjs/data/";

  window.EJS_startOnLoaded = true;
  window.EJS_language = "es";

  /*
    Ajustes para intentar reducir lag
  */
  window.EJS_volume = 0.4;
  window.EJS_threads = false;
  window.EJS_disableDatabases = true;
  window.EJS_gamePatchUrl = "";
  window.EJS_biosUrl = "";

  const oldLoader = document.getElementById("ejs-loader");

  if(oldLoader){
    oldLoader.remove();
  }

  const script = document.createElement("script");
  script.id = "ejs-loader";

  /*
    Esta ruta apunta al archivo loader.js
  */
  script.src =
  "https://dnielibarra.github.io/p/emulador/emulatorjs/data/loader.js";

  document.body.appendChild(script);
}
