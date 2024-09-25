document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verificar el usuario en el JSON
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.email === email && user.contraseña === password);

            if (user) {
                // Redirigir al usuario si la autenticación es exitosa
                window.location.href = 'generador.html'; // Cambia esto a la página que desees
            } else {
                // Mostrar mensaje de error si el usuario no está registrado
                document.getElementById('loginMessage').innerText = 'No estás registrado';
                document.getElementById('loginMessage').style.color = 'red';
            }
        })
        .catch(error => console.error('Error al autenticar usuario:', error));
});