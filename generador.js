// Inicializar el generador de códigos QR
const qr = new QRious({
    element: document.getElementById('qr-code'),
    size: 256
});

// Función para actualizar el código QR
function generateQrCode(text) {
    qr.value = text;
}

// Manejar el envío del formulario
const qrForm = document.getElementById('qr-form');
qrForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const documentType = document.getElementById('document-type').value;
    const id = document.getElementById('id').value;
    const bloodType = document.getElementById('blood-type').value;
    const program = document.getElementById('program').value;
    const contents = document.getElementById('contents').value;

    // Obtener la hora actual
    const now = new Date().toLocaleString();
    
    // Generar una clave única para identificar al usuario
    const userKey = `user_${documentType}_${id}`;
    
    // Obtener el estado almacenado en localStorage
    const storedData = localStorage.getItem(userKey);
    
    let info;
    if (storedData) {
        // Si ya existe un registro, es la segunda vez que se escanea
        const { entryTime } = JSON.parse(storedData);
        info = `Nombre: ${name}\nTipo de documento: ${documentType}\nNúmero de documento: ${id}\nTipo de sangre: ${bloodType}\nFicha del programa: ${program}\nContiene en el bolso: ${contents}\nHora de entrada: ${entryTime}\nHora de salida: ${now}`;

        // Eliminar el registro de localStorage
        localStorage.removeItem(userKey);
    } else {
        // Si no existe un registro, es la primera vez que se escanea
        info = `Nombre: ${name}\nTipo de documento: ${documentType}\nNúmero de documento: ${id}\nTipo de sangre: ${bloodType}\nFicha del programa: ${program}\nContiene en el bolso: ${contents}\nHora de entrada: ${now}`;

        // Almacenar el registro con la hora de entrada
        localStorage.setItem(userKey, JSON.stringify({ entryTime: now }));
    }

    // Generar el código QR
    generateQrCode(info);
});

// Habilitar la generación del código QR también cuando se presione la tecla Enter
document.getElementById('qr-form').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        qrForm.dispatchEvent(new Event('submit')); // Simular el envío del formulario
    }
});
