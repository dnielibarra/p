// Variables Globales e Instancia del Emulador Real
let snesEmulator = null;
let romCargada = false;
let animationFrameId = null;

const canvas = document.getElementById('snes-canvas');
const ctx = canvas.getContext('2d');
const romFileInput = document.getElementById('rom-file');

// Mapeo completo de IDs táctiles a los códigos de control internos de Snes9x
// Valores estándar: Up=0, Down=1, Left=2, Right=3, Start=4, Select=5, A=6, B=7, X=8, Y=9, L=10, R=11
const buttonMapping = {
    'pad-up': 0, 'pad-down': 1, 'pad-left': 2, 'pad-right': 3,
    'btn-start': 4, 'btn-select': 5,
    'btn-A': 6, 'btn-B': 7, 'btn-X': 8, 'btn-Y': 9,
    'btn-L': 10, 'btn-R': 11
};

// --- CONFIGURACIÓN DE BOTONES TÁLCTILES MULTITOUCH ---
Object.keys(buttonMapping).forEach(id => {
    const boton = document.getElementById(id);
    if (!boton) return;

    const snesKeyCode = buttonMapping[id];

    // Evento al presionar
    boton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (snesEmulator && romCargada) {
            snesEmulator.pressButton(0, snesKeyCode); // Puerto de control 1, ID del botón
        }
    }, { passive: false });

    // Evento al soltar
    boton.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (snesEmulator && romCargada) {
            snesEmulator.releaseButton(0, snesKeyCode);
        }
    }, { passive: false });
});

// --- INICIALIZACIÓN DEL MOTOR CUANDO SE CARGA EL ARCHIVO ---
romFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Si ya había un juego corriendo, lo detenemos
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        const romUint8 = new Uint8Array(arrayBuffer);

        try {
            // Inicializar la librería snes9x-js pasándole el Canvas
            // Snes9xJS se autoinyecta globalmente si se cargó el script en el HTML
            if (typeof Snes9xJS !== 'undefined') {
                snesEmulator = new Snes9xJS(canvas);
                snesEmulator.loadROM(romUint8);
                romCargada = true;
                
                // Arrancar el ciclo de ejecución a 60 FPS
                loopEmulador();
            } else {
                alert("Error: El motor Snes9x no se cargó correctamente desde internet.");
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo procesar la ROM de SNES: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
});

// --- BUCLE PRINCIPAL DE JUEGO (GAME LOOP) ---
function loopEmulador() {
    if (snesEmulator && romCargada) {
        // Ejecuta un frame del juego y lo dibuja en el canvas automáticamente
        snesEmulator.runFrame(); 
        animationFrameId = requestAnimationFrame(loopEmulador);
    }
}

// --- PANTALLA COMPLETA ---
document.getElementById('btn-fullscreen').addEventListener('click', () => {
    const contenedor = document.getElementById('emulator-container');
    if (!document.fullscreenElement) {
        contenedor.requestFullscreen().catch(err => {
            console.log("Error Fullscreen:", err);
        });
    } else {
        document.exitFullscreen();
    }
});

// --- SISTEMA DE GUARDADO / CARGA REAL (SRAM / STATE) ---
document.getElementById('btn-save').addEventListener('click', () => {
    if (!snesEmulator || !romCargada) return alert("Carga un juego primero");
    
    // Obtenemos el snapshot de la memoria del emulador como String/Base64 o Binario
    const saveState = snesEmulator.getSaveState(); 
    localStorage.setItem('snes_slot_1', JSON.stringify(saveState));
    alert("Partida guardada en la memoria local del navegador.");
});

document.getElementById('btn-load').addEventListener('click', () => {
    if (!snesEmulator || !romCargada) return alert("Carga un juego primero");
    
    const savedData = localStorage.getItem('snes_slot_1');
    if (!savedData) return alert("No hay datos guardados");

    const saveState = JSON.parse(savedData);
    snesEmulator.loadSaveState(saveState);
    alert("Partida restaurada con éxito.");
});
