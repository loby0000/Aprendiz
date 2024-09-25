// Obtener todos los usuarios (GET)
function fetchUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            const userListDiv = document.getElementById('userList');
            userListDiv.innerHTML = ''; // Limpiar lista antes de llenarla

            users.forEach(user => {
                userListDiv.innerHTML += `
                    <p>
                        ${user.name} 
                        <button onclick="showInfoModal('${user.id}')">Mostrar más información</button>
                        <button onclick="editUser('${user.id}')">Editar</button>
                        <button onclick="deleteUser('${user.id}')">Eliminar</button>
                    </p>
                `;
            });
        })
        .catch(error => console.error('Error al obtener usuarios:', error));
}

// Mostrar información específica de un usuario (GET) en la ventana modal
function showInfoModal(userId) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const infoModalContent = document.getElementById('infoModalContent');
            infoModalContent.innerHTML = `
                <p>Nombre: ${user.name}</p>
                <p>Tipo de Documento: ${user.documentType}</p>
                <p>${user.documentType}: ${user.ti}</p>
                <p>Tipo de Sangre: ${user.bloodType}</p>
                <p>Email: ${user.email}</p>
                <p>Contraseña: ${user.contraseña}</p>
                <p>Ficha de Formación: ${user.fichaFormacion}</p>
            `;
            document.getElementById('infoModal').style.display = 'block';
        })
        .catch(error => console.error('Error al obtener usuario:', error));
}

// Cerrar ventana modal de información
function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// Mostrar formulario de editar usuario (GET) en la ventana modal
function editUser(userId) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editName').value = user.name;
            document.getElementById('editTi').value = user.ti;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editcontraseña').value = user.contraseña;
            document.getElementById('editFichaFormacion').value = user.fichaFormacion;
            document.getElementById('editDocumentType').value = user.documentType;
            document.getElementById('editBloodType').value = user.bloodType;

            document.getElementById('editModal').style.display = 'block';
        })
        .catch(error => console.error('Error al obtener usuario:', error));
}

// Cerrar ventana modal de edición
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Agregar un nuevo usuario (POST)
document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;
    const ti = document.getElementById('ti').value;
    const fichaFormacion = document.getElementById('fichaFormacion').value;
    const documentType = document.getElementById('documentType').value;
    const bloodType = document.getElementById('bloodType').value;

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            contraseña: contraseña,
            ti: ti,
            fichaFormacion: fichaFormacion,
            documentType: documentType,
            bloodType: bloodType
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('addResult').innerText = 'Usuario agregado: ' + data.name;
        fetchUsers(); // Actualizar lista de usuarios
    })
    .catch(error => console.error('Error al agregar usuario:', error));
});

// Actualizar usuario (PUT)
document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const contraseña = document.getElementById('editcontraseña').value;
    const ti = document.getElementById('editTi').value;
    const fichaFormacion = document.getElementById('editFichaFormacion').value;
    const documentType = document.getElementById('editDocumentType').value;
    const bloodType = document.getElementById('editBloodType').value;

    fetch(`http://localhost:3000/user_data/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            contraseña: contraseña,
            ti: ti,
            fichaFormacion: fichaFormacion,
            documentType: documentType,
            bloodType: bloodType
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('editResult').innerText = 'Usuario actualizado: ' + data.name;
        closeEditModal(); // Cerrar el modal después de actualizar
        fetchUsers(); // Actualizar lista de usuarios
    })
    .catch(error => console.error('Error al actualizar usuario:', error));
});

// Eliminar un usuario (DELETE)
function deleteUser(userId) {
    fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE'
    })
    .then(() => {
        document.getElementById('deleteResult').innerText = 'Usuario con ID ' + userId + ' eliminado.';
        fetchUsers(); // Actualizar lista de usuarios
    })
    .catch(error => console.error('Error al eliminar usuario:', error));
}

// Inicializar el generador de códigos QR
const qr = new QRious({
    element: document.getElementById('qr-code'),
    size: 256
});

// Función para actualizar el código QR
function generateQrCode(text) {
    qr.value = text;
}

// Manejar el envío del formulario para generar código QR
document.getElementById('qr-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de la forma tradicional

    const name = document.getElementById('name').value;
    const documentType = document.getElementById('documentType').value;
    const id = document.getElementById('id').value;
    const bloodType = document.getElementById('bloodType').value;
    const program = document.getElementById('program').value;
    const contents = document.getElementById('contents').value;

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

        // Enviar la información al servidor para actualizar el registro
        fetch(`http://localhost:3000/user_data/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exitTime: now })
        })
        .then(response => response.json())
        .then(() => {
            // Generar el código QR solo después de actualizar
            generateQrCode(info);
        })
        .catch(error => console.error('Error al actualizar el registro:', error));
    } else {
        // Si no existe un registro, es la primera vez que se escanea
        info = `Nombre: ${name}\nTipo de documento: ${documentType}\nNúmero de documento: ${id}\nTipo de sangre: ${bloodType}\nFicha del programa: ${program}\nContiene en el bolso: ${contents}\nHora de entrada: ${now}`;

        // Almacenar el registro con la hora de entrada
        localStorage.setItem(userKey, JSON.stringify({ entryTime: now }));

        // Generar el código QR
        generateQrCode(info);
    }
});


// fetchUsers();




// // Obtener todos los usuarios (GET)
// function fetchUsers() {
//     fetch('http://localhost:3000/users')
//         .then(response => response.json())
//         .then(users => {
//             const userListDiv = document.getElementById('userList');
//             userListDiv.innerHTML = ''; // Limpiar lista antes de llenarla

//             users.forEach(user => {
//                 userListDiv.innerHTML += `
//                     <p>
//                         ${user.name} 
//                         <button onclick="getUserInfo('${user.id}')">Mostrar más información</button>
//                         <button onclick="editUser('${user.id}')">Editar</button>
//                         <button onclick="deleteUser('${user.id}')">Eliminar</button>
//                     </p>
//                 `;
//             });
//         })
//         .catch(error => console.error('Error al obtener usuarios:', error));
// }

// // Mostrar información específica de un usuario (GET)
// function getUserInfo(userId) {
//     fetch(`http://localhost:3000/users/${userId}`)
//         .then(response => response.json())
//         .then(user => {
//             const userInfoDiv = document.getElementById('userInfo');
//             userInfoDiv.innerHTML = `
//                 <h3>Información del usuario:</h3>
//                 <p>Nombre: ${user.name}</p>
//                 <p>Edad: ${user.age}</p>dd
//                 <p>Email: ${user.email}</p>
//             `;
//         })
//         .catch(error => console.error('Error al obtener usuario:', error));
// }

// // Agregar un nuevo usuario (POST)
// document.getElementById('addUserForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const name = document.getElementById('name').value;
//     const age = document.getElementById('age').value;
//     const email = document.getElementById('email').value;

//     fetch('http://localhost:3000/users', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: name,
//             age: age,
//             email: email
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('addResult').innerText = 'Usuario agregado: ' + data.name;
//         fetchUsers(); // Actualizar lista de usuarios
//     })
//     .catch(error => console.error('Error al agregar usuario:', error));
// });

// // Editar un usuario (PUT)
// function editUser(userId) {
//     fetch(`http://localhost:3000/users/${userId}`)
//         .then(response => response.json())
//         .then(user => {
//             document.getElementById('editUserId').value = user.id;
//             document.getElementById('editName').value = user.name;
//             document.getElementById('editAge').value = user.age;
//             document.getElementById('editEmail').value = user.email;
//             document.getElementById('editUserForm').style.display = 'block';
//         })
//         .catch(error => console.error('Error al obtener usuario:', error));
// }

// document.getElementById('editUserForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const userId = document.getElementById('editUserId').value;
//     const name = document.getElementById('editName').value;
//     const age = document.getElementById('editAge').value;
//     const email = document.getElementById('editEmail').value;

//     fetch(`http://localhost:3000/users/${userId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: name,
//             age: age,
//             email: email
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('editResult').innerText = 'Usuario actualizado: ' + data.name;
//         document.getElementById('editUserForm').style.display = 'none'; // Ocultar formulario
//         fetchUsers(); // Actualizar lista de usuarios
//     })
//     .catch(error => console.error('Error al actualizar usuario:', error));
// });

// // Eliminar un usuario (DELETE)
// function deleteUser(userId) {
//     fetch(`http://localhost:3000/users/${userId}`, {
//         method: 'DELETE'
//     })
//     .then(() => {
//         document.getElementById('deleteResult').innerText = 'Usuario con ID ' + userId + ' eliminado.';
//         fetchUsers(); // Actualizar lista de usuarios
//     })
//     .catch(error => console.error('Error al eliminar usuario:', error));
// }

// // // Cargar los usuarios al inicio
// fetchUsers();
