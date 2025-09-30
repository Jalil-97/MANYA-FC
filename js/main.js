// Función para cargar JSON
async function cargarDatos() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();

        mostrarTablaPosiciones(data.torneo.tabla_posiciones);
        mostrarGoleadores(data.goleadores);
        if (data.galeria) mostrarGaleria(data.galeria); // opcional si agregamos galería en JSON
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Animación fade-in simple
function fadeIn(element, delay = 0) {
    element.style.opacity = 0;
    element.style.transition = `opacity 0.6s ease ${delay}s`;
    setTimeout(() => {
        element.style.opacity = 1;
    }, 50); // pequeño timeout para activar la transición
}

// Mostrar tabla de posiciones con fade-in fila por fila
function mostrarTablaPosiciones(tabla) {
  const contenedor = document.getElementById('tabla-posiciones');
  if (!contenedor) return;

  // Ordenar por puntos y diferencia de goles
  tabla.sort((a, b) => {
    const diffA = a.gf - a.gc;
    const diffB = b.gf - b.gc;
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    } else {
      return diffB - diffA;
    }
  });

  let html = `
    <h3 class="text-center mb-3">Tabla de Posiciones</h3>
    <div class="table-responsive">
      <table class="table table-striped table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
  `;

  tabla.forEach(fila => {
    // Asegurarse que solo Manya FC tenga negrita
    const esManya = fila.equipo.toLowerCase() === 'manya fc';
    const claseManya = esManya ? 'fw-bold' : '';
    html += `
      <tr class="${claseManya}">
        <td>${fila.equipo}</td>
        <td>${fila.pj}</td>
        <td>${fila.pg}</td>
        <td>${fila.pe}</td>
        <td>${fila.pp}</td>
        <td>${fila.gf}</td>
        <td>${fila.gc}</td>
        <td>${fila.pts}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  contenedor.innerHTML = html;

  // Fade-in fila por fila
  const filas = contenedor.querySelectorAll('tbody tr');
  filas.forEach((fila, index) => fadeIn(fila, index * 0.1));
}



// Mostrar goleadores con fade-in
function mostrarGoleadores(goleadores) {
  const contenedor = document.getElementById('tabla-goleadores');
  if (!contenedor) return;

  // Ordenar por goles descendente
  goleadores.sort((a, b) => b.goles - a.goles);

  let html = `
    <h3 class="text-center mb-3">Goleadores</h3>
    <ul class="list-group list-group-flush">
  `;

  goleadores.forEach(jugador => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
               ${jugador.nombre}
               <span class="badge bg-dark rounded-pill">${jugador.goles}</span>
             </li>`;
  });

  html += `</ul>`;

  contenedor.innerHTML = html;

  // Fade-in de cada item
  const items = contenedor.querySelectorAll('li');
  items.forEach((item, index) => fadeIn(item, index * 0.1));
}


// Mostrar galería (opcional) con fade-in
function mostrarGaleria(imagenes) {
    const contenedor = document.getElementById('galeria');
    if (!contenedor) return;

    let html = '<div class="row g-3">';
    imagenes.forEach((imgSrc, index) => {
        html += `
      <div class="col-6 col-md-4 col-lg-3">
        <img src="${imgSrc}" class="img-fluid rounded" alt="Foto ${index + 1}">
      </div>
    `;
    });
    html += '</div>';

    contenedor.innerHTML = html;

    // Aplicar fade-in con delay a cada imagen
    const imgs = contenedor.querySelectorAll('img');
    imgs.forEach((img, index) => fadeIn(img, index * 0.1));
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatos);
