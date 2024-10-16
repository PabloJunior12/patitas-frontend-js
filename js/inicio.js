
window.addEventListener('load', function(){
    

    const tipoDocumento = this.document.getElementById('tipoDocumento');
    const numeroDocumento = this.document.getElementById('numeroDocumento');
    const password = this.document.getElementById('password');
    const btnIngresar = this.document.getElementById('btnIngresar');
    const resultLogout = JSON.parse(this.localStorage.getItem('resultLogout'));
    const msgLogout = document.getElementById('msgLogout');

   
    const logoutMessage = localStorage.getItem('logoutMessage');

    if (logoutMessage) {
  
        msgLogout.innerHTML = logoutMessage;
        msgLogout.style.display = 'block';
       
    }

    if (resultLogout) {
        mostrarAlerta(`${resultLogout.mensajeError}`);
    }
   

    btnIngresar.addEventListener('click',function(){
       
        if(tipoDocumento.value === null || tipoDocumento.value.trim() === ''||
            numeroDocumento.value === null || numeroDocumento.value.trim() === ''||
            password.value === null || password.value.trim() === '' ){
                mostrarAlerta('Error: Debe completar correctamente sus credenciales');
                
                return;
            }
            ocultarAlerta();
            autenticar();
    });

});

function mostrarAlerta(mensaje){
    msgError.innerHTML = mensaje;
     msgError.style.display = 'block';
     setTimeout(() => {
        ocultarAlerta();
    }, 3000);
}
function ocultarAlerta(mensaje){
     msgError.innerHTML = '';
     msgError.style.display = 'none';
}
async function autenticar(){

    const url = 'http://localhost:9092/login/login-async';

    const data = {

        tipoDocumento : tipoDocumento.value,
        numeroDocumento: numeroDocumento.value,
        password: password.value
    };

    try{
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        });
        if(!response.ok){

              mostrarAlerta('Error: Ocurrio un problema con la autenticacion');
              throw new Error(`Error: ${response.statusText}`);

       }

        const result = await response.json();


        if(result.codigo === '00'){

            localStorage.setItem('result',JSON.stringify(result));
            localStorage.setItem('tipoDocumento', tipoDocumento.value);
            localStorage.setItem('numeroDocumento', numeroDocumento.value); 
            localStorage.removeItem('resultLogout');
            window.location.replace('principal.html');

        }else{

            mostrarAlerta(result.mensaje);

        }

    }catch(error){
  
        mostrarAlerta('Error: Ocurrio un problema ')

    }
}
