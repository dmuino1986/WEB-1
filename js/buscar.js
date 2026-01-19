async function ejecutarBusqueda(index = false) {
  const inputElement = document.getElementById("inputBusqueda");
  const query = inputElement.value.toLowerCase().trim();
  const lista = document.getElementById("listaResultados");

  if (query === "") {
    lista.innerHTML =
      '<div class="alert alert-light shadow-sm text-dark">Escribe algo para buscar...</div>';
    return;
  }

  lista.innerHTML =
    '<div class="text-center py-3"><div class="spinner-border text-light" role="status"></div></div>';

  try {
    let datosUrl = "../js/datos.json";
    if (index) {
      datosUrl = "./js/datos.json";
    }
    const respuesta = await fetch(datosUrl);
    if (!respuesta.ok) {
      alert("No se pudo cargar la base de datos.");
      return;
    }

    const paginas = await respuesta.json();

    const resultados = paginas.filter((pagina) => {
      return (
        pagina.titulo.toLowerCase().includes(query) ||
        pagina.contenido.toLowerCase().includes(query)
      );
    });

    lista.innerHTML = "";

    if (resultados.length === 0) {
      lista.innerHTML = `<div class="alert alert-danger shadow-sm">No se encontraron resultados para "${query}"</div>`;
    } else {
      const tituloSeccion = document.createElement("h3");
      tituloSeccion.className = "text-white mb-3";
      tituloSeccion.style.textShadow = "1px 1px 2px rgba(0,0,0,0.5)";
      tituloSeccion.innerText = "Resultados encontrados:";
      lista.appendChild(tituloSeccion);

      resultados.forEach((res) => {
        if (index) {
          res.url = `./contenido/${res.url}`;
        }
        const card = document.createElement("div");

        card.className = "card mb-2 border-0 shadow-sm";
        card.style.borderRadius = "2px";
        card.style.overflow = "hidden";

        card.innerHTML = `
                    <div class="card-body p-3" style="background-color: #ffffff;">
                        <h4 class="mb-1">
                            <a href="${res.url}" class="text-decoration-none" style="color: #003366; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                ${res.titulo}
                            </a>
                        </h4>
                        <p class="mb-0" style="font-size: 0.95rem; color: #555555 !important; font-family: Arial, sans-serif;">
                            ${res.contenido.substring(0, 160)}...
                        </p>
                    </div>
                `;
        lista.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Error:", error);
    lista.innerHTML =
      '<div class="alert alert-danger shadow-sm">Error al conectar con la base de datos.</div>';
  }
}

document
  .getElementById("inputBusqueda")
  ?.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      ejecutarBusqueda();
    }
  });
