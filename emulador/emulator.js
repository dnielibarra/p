const canvas =
document.getElementById("screen");

const ctx =
canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0,0,256,224);

ctx.fillStyle = "white";
ctx.font = "16px Arial";

ctx.fillText(
"IBARRA 8-BIT",
70,
100
);

ctx.fillText(
"Version 0.1",
85,
130
);

document
.getElementById("fullscreenBtn")
.addEventListener(
"click",
()=>{

    document
    .documentElement
    .requestFullscreen();

});
