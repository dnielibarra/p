// Referencias al DOM
const canvas = document.getElementById('snes-canvas');
const ctx = canvas.getContext('2d');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnSave = document.getElementById('btn-save');
const btnLoad = document.getElementById('btn-load');
const romFile = document.getElementById('rom-file');

// Estado Virtual del Control SNES
const controllerState = {
    up: false, down: false, left: false, right: false,
    A: false, B: false, X: false, Y: false,
    L: false, R: false, select: false, start: false
};

// --- SOPORTE TOUCH MEJORADO ---
// Mapeamos los IDs HTML con las propiedades del control
const touchMapping = {
    'pad-up': 'up', 'pad-down': 'down', 'pad-left': 'left', 'pad-right': 'right',
    'btn-A': 'A', 'btn-B': 'B', 'btn-X': 'X', 'btn-Y': 'Y',
    'btn-L': 'L', 'btn-R': 'R', 'btn-select': 'select', 'btn-start': 'start'
};

// Añadir listeners para pantallas táctiles de manera eficiente
Object.keys(touchMapping).forEach(btnId => {
    const button = document.getElementById(btnId);
    if (!button) return;

    // Cuando el usuario presiona el botón virtual
    button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evita zoom o comportamiento por defecto del móvil
        const key = touchMapping[btnId];
        controllerState[key] = true;
        button.style.background = "rgba(255,255,255,0.7)";
        console.log(`Presionado: ${key}`, controllerState);
    }, { passive: false });

    // Cuando el usuario levanta el dedo del botón virtual
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        const key = touchMapping[btnId];
        controllerState[key] = false;
        button.style.background = ""; // Restablece el CSS original
    }, { passive: false });
});

// --- FUNCIONALIDAD: FULLSCREEN (VERTICAL / HORIZONTAL) ---
btnFullscreen.addEventListener('click', () => {
    const container = document.getElementById('emulator-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error al activar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// --- FUNCIONALIDAD: CARGAR ROM ---
romFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const romBuffer = event.target.result;
        // Aquí pasamos el 'romBuffer' al motor de SNES cargado en WebAssembly
        console.log("ROM cargada exitosamente. Tamaño:", romBuffer.byteLength, "bytes");
        inicializarMotorSNES(romBuffer);
    };
    reader.readAsArrayBuffer(file);
});

// --- FUNCIONALIDAD: GUARDAR Y CARGAR PARTIDA (Save States) ---
btnSave.addEventListener('click', () => {
    // En un emulador real, el motor exporta un Array de bytes (RAM/State)
    // Simularemos un objeto de estado básico para esta estructura:
    const emuStateMock = {
        timestamp: Date.now(),
        score: 9999, 
        // Aquí iría: motor.exportSaveState()
    };
    
    localStorage.setItem('snes_save_state', JSON.stringify(emuStateMock));
    alert('¡Partida guardada con éxito!');
});

btnLoad.addEventListener('click', () => {
    const savedData = localStorage.getItem('snes_save_state');
    if (!savedData) {
        alert('No se encontró ninguna partida guardada.');
        return;
    }
    
    const emuState = JSON.parse(savedData);
    console.log("Cargando datos...", emuState);
    // Aquí iría: motor.importSaveState(emuState)
    alert('Partida cargada.');
});

// --- Loop del Emulador ficticio ---
function inicializarMotorSNES(buffer) {
    // Esta función dibuja un patrón de prueba en el canvas para verificar que funciona
    function arrancarLoop() {
        // Limpiar pantalla
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar un cuadrado verde que se mueve si dejas presionado "Derecha" o "Abajo"
        ctx.fillStyle = "#00ff00";
        let posX = controllerState.right ? 100 : 50;
        let posY = controllerState.down ? 100 : 50;
        ctx.fillRect(posX, posY, 40, 40);

        requestAnimationFrame(arrancarLoop);
    }
    arrancarLoop();
}