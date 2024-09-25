// Función para obtener todos los usuarios del db.json
function fetchUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            const studentTableBody = document.getElementById('studentTableBody');
            studentTableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            users.forEach(user => {
                studentTableBody.innerHTML += `
                    <tr id="row-${user.id}">
                        <td>${user.name}</td>
                        <td>${user.email || '--'}</td>
                        <td>${user.ti || '--'}</td>
                        <td>${user.fichaFormacion || '--'}</td>
                        <td>
                            <button class="button" onclick="deleteUser('${user.id}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error al obtener usuarios:', error));
}

// Función para eliminar un usuario
function deleteUser(userId) {
    fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Eliminar la fila del usuario directamente del DOM
            const userRow = document.getElementById(`row-${userId}`);
            if (userRow) {
                userRow.remove();
            }
            document.getElementById('deleteResult').innerText = `Usuario con ID ${userId} eliminado.`;
        } else {
            throw new Error('No se pudo eliminar el usuario.');
        }
    })
    .catch(error => console.error('Error al eliminar usuario:', error));
}

// Función para eliminar todos los usuarios
function deleteAllUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            // Crear una promesa para cada eliminación
            const deletePromises = users.map(user => {
                return fetch(`http://localhost:3000/users/${user.id}`, {
                    method: 'DELETE'
                });
            });

            // Ejecutar todas las promesas de eliminación
            Promise.all(deletePromises)
                .then(() => {
                    // Limpiar la tabla del DOM
                    const studentTableBody = document.getElementById('studentTableBody');
                    studentTableBody.innerHTML = '';
                    document.getElementById('deleteResult').innerText = 'Todos los estudiantes han sido eliminados.';
                })
                .catch(error => console.error('Error al eliminar estudiantes:', error));
        })
        .catch(error => console.error('Error al obtener usuarios:', error));
}

// Llamar a la función para cargar los usuarios cuando se cargue la página
window.onload = fetchUsers;

// Agregar el evento al botón de eliminar todos los usuarios
document.getElementById('deleteAllButton').addEventListener('click', deleteAllUsers);
