async function cargarDatos() {
  try {
    const res = await fetch("data/data.json");
    if (!res.ok) throw new Error("No se pudo cargar data/data.json");
    const data = await res.json();

    /* ---------------------------
       ORDENAR
       - Tabla: pts DESC, luego diferencia de gol (GF-GC), luego GF
       - Goleadores: goles DESC
       --------------------------- */
    if (Array.isArray(data.tabla)) {
      data.tabla.sort((a, b) => {
        if ((b.pts - a.pts) !== 0) return b.pts - a.pts;
        const gdA = (a.gf || 0) - (a.gc || 0);
        const gdB = (b.gf || 0) - (b.gc || 0);
        if ((gdB - gdA) !== 0) return gdB - gdA;
        return (b.gf || 0) - (a.gf || 0);
      });
    }

    if (Array.isArray(data.goleadores)) {
      data.goleadores.sort((a, b) => (b.goles || 0) - (a.goles || 0));
    }

    /* ---------------------------
       PINTAR TABLA
       --------------------------- */
    const tabla = document.getElementById("tabla-posiciones");
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>
        ${ (data.tabla || []).map(eq => `
          <tr>
            <td>${eq.equipo || ''}</td>
            <td>${eq.pj ?? ''}</td>
            <td>${eq.pg ?? ''}</td>
            <td>${eq.pe ?? ''}</td>
            <td>${eq.pp ?? ''}</td>
            <td>${eq.gf ?? ''}</td>
            <td>${eq.gc ?? ''}</td>
            <td>${eq.pts ?? ''}</td>
          </tr>
        `).join('') }
      </tbody>
    `;

    /* ---------------------------
       RESULTADOS (todos)
       --------------------------- */
    const resultados = document.getElementById("lista-resultados");
    resultados.innerHTML = (data.resultados || []).map(r => `
      <div class="resultado">
        <strong>${r.fecha || ''}:</strong> ${r.local || ''} ${r.golesLocal ?? ''} - ${r.golesVisitante ?? ''} ${r.visitante || ''}
      </div>
    `).join('');

    /* ---------------------------
       GOLEADORES (mismo formato que resultados)
       --------------------------- */
    const goleadoresDiv = document.getElementById("lista-goleadores");
    goleadoresDiv.innerHTML = (data.goleadores || []).map(g => `
      <div class="resultado">
        <strong>${g.jugador || ''}</strong> - ${g.goles ?? 0} goles
      </div>
    `).join('');

    /* ---------------------------
       CAROUSEL
       --------------------------- */
    const carouselInner = document.getElementById("carousel-inner");
    const carouselFooter = document.getElementById("carousel-footer");

    if (Array.isArray(data.trofeos) && data.trofeos.length > 0) {
      carouselInner.innerHTML = data.trofeos.map(t => `<img src="${t.img}" alt="${t.titulo || ''}">`).join('');
      let index = 0;
      function mostrarSlide(i) {
        carouselInner.style.transform = `translateX(-${i * 100}%)`;
        carouselFooter.textContent = data.trofeos[i].titulo || '';
      }
      mostrarSlide(index);
      setInterval(() => {
        index = (index + 1) % data.trofeos.length;
        mostrarSlide(index);
      }, 3500);
    } else {
      carouselInner.innerHTML = '<div class="no-trofeos">No hay trofeos cargados</div>';
      carouselFooter.textContent = '';
    }

  } catch (err) {
    console.error("Error cargando datos:", err);
    const tabla = document.getElementById("tabla-posiciones");
    tabla.innerHTML = '<tr><td colspan="8">Error cargando datos</td></tr>';
    document.getElementById("lista-resultados").innerHTML = '<div class="resultado">Error cargando resultados</div>';
    document.getElementById("lista-goleadores").innerHTML = '<div class="resultado">Error cargando goleadores</div>';
  }
}

cargarDatos();
