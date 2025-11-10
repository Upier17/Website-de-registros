const tabla = document.getElementById("tabla");
const form = document.getElementById("form");

async function cargar() {
  const res = await fetch("/api/personas");
  const personas = await res.json();
  tabla.innerHTML = personas.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.edad}</td>
      <td>${p.ciudad}</td>
      <td>
        <button onclick="editar(${p.id}, '${p.nombre}', ${p.edad}, '${p.ciudad}')">Editar</button>
        <button onclick="eliminar(${p.id})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const datos = {
    nombre: form.nombre.value,
    edad: form.edad.value,
    ciudad: form.ciudad.value
  };
  await fetch("/api/personas", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(datos)
  });
  form.reset();
  cargar();
});

async function eliminar(id) {
  await fetch(`/api/personas/${id}`, { method: "DELETE" });
  cargar();
}

function editar(id, nombre, edad, ciudad) {
  form.nombre.value = nombre;
  form.edad.value = edad;
  form.ciudad.value = ciudad;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const datos = {
      nombre: form.nombre.value,
      edad: form.edad.value,
      ciudad: form.ciudad.value
    };
    await fetch(`/api/personas/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(datos)
    });
    form.reset();
    form.onsubmit = originalSubmit;
    cargar();
  };
}

const originalSubmit = form.onsubmit;
cargar();
