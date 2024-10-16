window.addEventListener('load', function () {

    const msgSucces = this.document.getElementById('msgSucces');
    const msgError = this.document.getElementById('msgError');
    const result = JSON.parse(this.localStorage.getItem('result'));
    const btnLogout = this.document.getElementById('btnCerrarSesion');

 
    if (result && result.nombreUsuario) {

        mostrarAlerta(`¡Hola, ${result.nombreUsuario}!`, msgSucces);

    } else {

        mostrarError("No se encontró información de usuario. Por favor, inicie sesión.", msgError);
   
    }

    btnLogout.addEventListener('click', function (event) {
        event.preventDefault(); 
        logout(); 
    });
    
});

function mostrarError(mensaje, element) {
    element.innerHTML = mensaje;
    element.style.display = 'block';
}

function mostrarAlerta(mensaje, element) {
    element.innerHTML = mensaje;
    element.style.display = 'block';
}

function ocultarAlerta(element) {
    element.innerHTML = '';
    element.style.display = 'none';
}

async function logout() {

    const url = 'http://localhost:9092/login/logout-async';
    const tipoDocumento = localStorage.getItem('tipoDocumento');
    const numeroDocumento = localStorage.getItem('numeroDocumento');

    if (!tipoDocumento || !numeroDocumento) {
    
        mostrarError("Error: No se encontraron datos válidos para cerrar sesión. Por favor, inténtelo de nuevo.",
             document.getElementById('msgError'));
        return;
    }

    const data = {
        tipoDocumento,
        numeroDocumento
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Manejo de error en caso de respuesta no exitosa
        if (!response.ok) {
            const errorMessage = await response.text(); 
            
            mostrarError(`${errorMessage}. Por favor, inténtelo de nuevo.`, document.getElementById('msgError'));
            return;
        }

 
        const resultLogout = await response.json();
    
     
        if (resultLogout.errorMessage === "Exito") {
          
            localStorage.removeItem('result');
            localStorage.removeItem('tipoDocumento');
            localStorage.removeItem('numeroDocumento');
       
            localStorage.setItem('logoutMessage', "Cierre de sesión realizado correctamente");
            window.location.replace('index.html'); 

        } else {

            mostrarError(`Error: ${resultLogout.errorMessage}. Inténtelo nuevamente.`, document.getElementById('msgError'));
       
        }
    } catch (error) {
      
        mostrarAlerta('Error: Ocurrió un problema al cerrar sesión', document.getElementById('msgSucces'));
    }
}

