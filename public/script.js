// ====== CONFIGURACIÓN GENERAL ======
const API_URL = "http://localhost:3000/api/personas";

// ====== CARGAR PERSONAS ======
document.addEventListener("DOMContentLoaded", loadPeople);

function loadPeople() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderTable(data))
    .catch(err => console.error("Error al cargar:", err));
}

function renderTable(people) {
  const body = document.getElementById("moviesBody");
  body.innerHTML = "";

  people.forEach(person => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${person.id}</td>
      <td>${person.nombre}</td>
      <td>${person.edad}</td>
      <td>${person.ciudad}</td>
      <td><button onclick="editPerson(${person.id})">✏️</button></td>
      <td><button onclick="deletePerson(${person.id})">🗑️</button></td>
    `;

    row.addEventListener("click", (e) => {
      if (!e.target.closest("button")) openModal(person);
    });

    body.appendChild(row);
  });
}

// ====== FORMULARIO ======
function openForm() {
  document.getElementById("formContainer").style.display = "block";
  document.getElementById("formTitle").textContent = "Agregar Persona";
  clearForm();
}

function closeForm() {
  document.getElementById("formContainer").style.display = "none";
}

function clearForm() {
  document.getElementById("movie-id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("year").value = "";
  document.getElementById("poster").value = "";
  document.getElementById("description").value = "";
  document.getElementById("trailer").value = "";
}

// ====== GUARDAR ======
function saveMovie() {
  const id = document.getElementById("movie-id").value;

  const person = {
    nombre: document.getElementById("title").value,
    edad: document.getElementById("genre").value,
    ciudad: document.getElementById("year").value
  };

  if (id) {
    updatePerson(id, person);
  } else {
    createPerson(person);
  }
}

function createPerson(person) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(person)
  })
    .then(() => {
      closeForm();
      loadPeople();
    })
    .catch(err => console.error("Error al crear:", err));
}

function updatePerson(id, person) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(person)
  })
    .then(() => {
      closeForm();
      loadPeople();
    })
    .catch(err => console.error("Error al editar:", err));
}

// ====== EDITAR ======
function editPerson(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(person => {
      openForm();
      document.getElementById("formTitle").textContent = "Editar Persona";

      document.getElementById("movie-id").value = person.id;
      document.getElementById("title").value = person.nombre;
      document.getElementById("genre").value = person.edad;
      document.getElementById("year").value = person.ciudad;
    });
}

// ====== ELIMINAR ======
function deletePerson(id) {
  if (!confirm("¿Seguro?")) return;

  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => loadPeople())
    .catch(err => console.error("Error al eliminar:", err));
}

// ====== MODAL ======
function openModal(person) {
  document.getElementById("modalTitle").textContent = person.nombre;

  document.getElementById("modalDescription").textContent =
    `Edad: ${person.edad}\nCiudad: ${person.ciudad}`;

  // Ocultamos elementos que no existen en personas
  document.getElementById("modalImage").style.display = "none";
  document.getElementById("modalTrailer").style.display = "none";

  document.getElementById("movieModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}
