document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;

    // Aquí puedes validar si el email y la contraseña coinciden con los datos del administrador
    if (adminEmail === 'admin@gmail.com' && adminPassword === '123') {
        // Redirecciona al panel de administración
        window.location.href = 'adminPanel.html';
    } else {
        // Muestra mensaje de error
        document.getElementById('adminLoginMessage').textContent = 'Correo o contraseña incorrectos.';
    }
});
