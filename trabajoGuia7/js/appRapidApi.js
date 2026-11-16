
const RAPIDAPI_KEY = "97cc63ab88msh1ce569d2a244bb0p1e5a27jsn074ea48891d3"; 

const RAPIDAPI_HOST = "free-to-play-games-database.p.rapidapi.com";

const URL_LISTA = `https://${RAPIDAPI_HOST}/api/games`;

const opcionesFetch = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
    }
};

const listaElementos = document.getElementById("listaElementos");
const contenedorDetalle = document.getElementById("contenedorDetalle");
const loaderLista = document.getElementById("loaderLista");
const loaderDetalle = document.getElementById("loaderDetalle");
const mensajeErrorLista = document.getElementById("mensajeErrorLista");
const mensajeErrorDetalle = document.getElementById("mensajeErrorDetalle");

const obtenerListado = async function () {
    try {
        loaderLista.style.display = "block";
        mensajeErrorLista.classList.add("d-none");
        listaElementos.textContent = ""; 

        const respuesta = await fetch(URL_LISTA, opcionesFetch);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const juegos = await respuesta.json();

        const listaReducida = juegos.slice(0, 15);

        listaReducida.forEach(juego => {
            const li = document.createElement("li");
            li.setAttribute("class", "list-group-item lista-item d-flex align-items-center");
            
            const img = document.createElement("img");
            img.setAttribute("src", juego.thumbnail);
            img.setAttribute("style", "width: 60px; height: 40px; object-fit: cover; margin-right: 15px; border-radius: 5px;");
            
            const texto = document.createElement("span");
            texto.textContent = juego.title;
            texto.setAttribute("class", "fw-bold");

            li.appendChild(img);
            li.appendChild(texto);

            li.addEventListener("click", () => {
                document.querySelectorAll(".lista-item").forEach(el => el.classList.remove("active"));
                li.classList.add("active");
                obtenerDetalle(juego.id); 
            });

            listaElementos.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        mensajeErrorLista.textContent = "Error al cargar la lista. " + error.message;
        mensajeErrorLista.classList.remove("d-none");
    } finally {
        loaderLista.style.display = "none";
    }
};

const obtenerDetalle = async function (idJuego) {
    try {
        loaderDetalle.style.display = "block";
        mensajeErrorDetalle.classList.add("d-none");
        
        while (contenedorDetalle.firstChild) {
            contenedorDetalle.removeChild(contenedorDetalle.firstChild);
        }

        const urlDetalle = `https://${RAPIDAPI_HOST}/api/game?id=${idJuego}`;
        
        const respuesta = await fetch(urlDetalle, opcionesFetch);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const juego = await respuesta.json();

        const row = document.createElement("div");
        row.setAttribute("class", "row align-items-center");

        // Columna de la Imagen
        const colImg = document.createElement("div");
        colImg.setAttribute("class", "col-md-5 text-center mb-3 mb-md-0");
        
        const img = document.createElement("img");
        img.setAttribute("src", juego.thumbnail);
        img.setAttribute("style", "width: 100%; max-width: 250px;");
        colImg.appendChild(img);

        // Columna de los Datos
        const colDatos = document.createElement("div");
        colDatos.setAttribute("class", "col-md-7");

        const titulo = document.createElement("h2");
        titulo.textContent = juego.title;
        titulo.setAttribute("class", "fw-bold mb-3 text-primary");

        const genero = document.createElement("p");
        genero.innerHTML = `<strong>Género:</strong> ${juego.genre}`;

        const plataforma = document.createElement("p");
        plataforma.innerHTML = `<strong>Plataforma:</strong> ${juego.platform}`;

        const desarrollador = document.createElement("p");
        desarrollador.innerHTML = `<strong>Desarrollador:</strong> ${juego.developer}`;

        const fecha = document.createElement("p");
        fecha.innerHTML = `<strong>Lanzamiento:</strong> ${juego.release_date}`;

        const descripcion = document.createElement("p");
        descripcion.textContent = juego.short_description;
        descripcion.setAttribute("class", "mt-3");

        colDatos.appendChild(titulo);
        colDatos.appendChild(genero);
        colDatos.appendChild(plataforma);
        colDatos.appendChild(desarrollador);
        colDatos.appendChild(fecha);
        colDatos.appendChild(descripcion);

        row.appendChild(colImg);
        row.appendChild(colDatos);
        contenedorDetalle.appendChild(row);

    } catch (error) {
        console.error(error);
        mensajeErrorDetalle.textContent = "Error al cargar el detalle. " + error.message;
        mensajeErrorDetalle.classList.remove("d-none");
    } finally {
        loaderDetalle.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", obtenerListado);