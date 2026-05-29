const canvas =
document.getElementById("screen");

const ctx =
canvas.getContext("2d");

/* PANTALLA INICIAL */

ctx.fillStyle="black";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

ctx.fillStyle="white";

ctx.font="20px Arial";

ctx.fillText(
"EMULADOR LISTO",
40,
110
);

/* PRESENTACION */

window.addEventListener(
"load",
()=>{

    setTimeout(()=>{

        const splash =
        document.getElementById(
        "splash"
        );

        splash.style.opacity="0";

        setTimeout(()=>{

            splash.remove();

        },1000);

    },2500);

});

/* FULLSCREEN */

document
.getElementById("fullscreenBtn")
.addEventListener(
"click",
()=>{

    document.documentElement
    .requestFullscreen();

});

/* CARGA ROM */

const romInput =
document.getElementById("romInput");

romInput.addEventListener(
"change",
(e)=>{

    const file =
    e.target.files[0];

    if(!file) return;

    romInput.style.display =
    "none";

    ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
    );

    ctx.fillStyle="white";

    ctx.font="16px Arial";

    ctx.fillText(
    "ROM CARGADA:",
    10,
    40
    );

    ctx.fillText(
    file.name,
    10,
    70
    );

});
