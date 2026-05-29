const romLoader = document.getElementById("romLoader");

romLoader.addEventListener("change", (e)=>{

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function(){

        const romData = new Uint8Array(reader.result);

        console.log("ROM cargada");
        console.log(romData.length);

        iniciarEmulador(romData);

    };

    reader.readAsArrayBuffer(file);

});

function iniciarEmulador(rom){

    console.log("Aquí iría el núcleo SNES");

}
