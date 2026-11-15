// Obteniendo la referencia de los elementos
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
const bodyModal = document.getElementById("idBodyModal");

const validarYMostrar = function () {
    // Obteniendo los valores de los inputs de texto
    const nombre = document.getElementById("idNombre").value.trim();
    const apellidos = document.getElementById("idApellidos").value.trim();
    const fecha = document.getElementById("idFechaNac").value;
    const correo = document.getElementById("idCorreo").value.trim();
    const pass1 = document.getElementById("idPassword").value;
    const pass2 = document.getElementById("idPasswordRepetir").value;
    const paisSelect = document.getElementById("idCmPais");

    // a. Validar que los campos no estén vacíos
    if (nombre === "" || apellidos === "" || fecha === "" || correo === "" || pass1 === "" || pass2 === "") {
        alert("Error: Todos los campos de texto son obligatorios.");
        return;
    }

    // b. Validar que la fecha de nacimiento no supere la fecha actual
    const fechaActual = new Date();
    const fechaIngresada = new Date(fecha);
    // Ajustamos las horas a 0 para comparar solo días
    fechaActual.setHours(0,0,0,0); 
    if (fechaIngresada > fechaActual) {
        alert("Error: La fecha de nacimiento no puede ser en el futuro.");
        return;
    }

    // c. Validar correo con Expresión Regular
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        alert("Error: El formato del correo electrónico no es válido.");
        return;
    }

    // d. Validar que las contraseñas sean iguales
    if (pass1 !== pass2) {
        alert("Error: Las contraseñas no coinciden.");
        return;
    }

    // e. Verificar que al menos un checkbox de "intereses" esté seleccionado
    const interesesSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
    if (interesesSeleccionados.length === 0) {
        alert("Error: Debe seleccionar al menos un interés.");
        return;
    }

    // f. Verificar que se haya seleccionado una carrera (radio buttons)
    const carreraSeleccionada = document.querySelector('input[name="idRdCarrera"]:checked');
    if (!carreraSeleccionada) {
        alert("Error: Debe seleccionar una carrera.");
        return;
    }

    // g. Verificar que se haya seleccionado un país
    if (paisSelect.selectedIndex === 0) {
        alert("Error: Debe seleccionar un país de origen.");
        return;
    }

    // --- SI TODO ESTÁ CORRECTO, CREAMOS LA TABLA CON DOM ---
    mostrarTablaDOM(nombre, apellidos, fecha, correo, interesesSeleccionados, carreraSeleccionada, paisSelect);
};

const mostrarTablaDOM = function (nombre, apellidos, fecha, correo, intereses, carrera, paisSelect) {
    // Limpiamos el modal SIN usar innerHTML
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }

    // 1. Crear estructura de la tabla
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-bordered table-striped");

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // 2. Crear la cabecera (thead)
    const trHead = document.createElement("tr");
    const thCampo = document.createElement("th");
    thCampo.textContent = "Campo";
    const thValor = document.createElement("th");
    thValor.textContent = "Valor";
    
    trHead.appendChild(thCampo);
    trHead.appendChild(thValor);
    thead.appendChild(trHead);

    // 3. Función auxiliar para crear filas (tr con 2 td)
    const agregarFila = (campo, valor) => {
        const tr = document.createElement("tr");
        const tdCampo = document.createElement("td");
        const tdValor = document.createElement("td");
        
        tdCampo.textContent = campo;
        tdValor.textContent = valor;
        
        tr.appendChild(tdCampo);
        tr.appendChild(tdValor);
        tbody.appendChild(tr);
    };

    // 4. Extraer textos visibles de los checkbox y radio seleccionados
    let textoIntereses = "";
    intereses.forEach(ck => {
        // nextElementSibling obtiene el <label> que está justo al lado
        textoIntereses += ck.nextElementSibling.textContent + " | ";
    });
    
    const textoCarrera = carrera.nextElementSibling.textContent;
    const textoPais = paisSelect.options[paisSelect.selectedIndex].text;

    // 5. Llenar el cuerpo de la tabla (tbody)
    agregarFila("Nombres", nombre);
    agregarFila("Apellidos", apellidos);
    agregarFila("Fecha Nacimiento", fecha);
    agregarFila("Correo Electrónico", correo);
    agregarFila("Intereses", textoIntereses);
    agregarFila("Carrera", textoCarrera);
    agregarFila("País de Origen", textoPais);

    // 6. Unir todo e insertarlo en el modal
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    bodyModal.appendChild(tabla);

    // Mostrar el modal
    modal.show();
};

// agregando eventos al boton
button.onclick = () => {
    validarYMostrar();
};