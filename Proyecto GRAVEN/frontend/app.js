document.addEventListener('DOMContentLoaded', () => {
    // Cargar tareas cuando el DOM esté listo
    cargarTareas();
  
    // Manejar el formulario para agregar tarea
    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const taskName = document.getElementById('task-name').value.trim();
      if (taskName !== "") {
        const newTask = { name: taskName, status: 0 }; // estado 0 es "no completada"
        agregarTarea(newTask);
      }
    });
  });
  
  // Obtener todas las tareas desde el backend
  function cargarTareas() {
    fetch('http://localhost:5000/tasks')
      .then(response => response.json())
      .then(tasks => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Limpiar la lista antes de cargar las tareas

        tasks.forEach(task => {
          const li = document.createElement('li');

          // Crear un span para el texto de la tarea
          const taskText = document.createElement('span');
          taskText.textContent = `${task.name} - ${task.status ? 'Completada' : 'No completada'}`;
          taskText.classList.add('task-text');

          // Crear un contenedor para los botones
          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('task-buttons');

          // Botón para cambiar el estado de la tarea
          const toggleButton = document.createElement('button');
          toggleButton.textContent = task.status ? 'Marcar como no completada' : 'Marcar como completada';
          toggleButton.classList.add('toggle-btn');
          toggleButton.onclick = () => toggleStatus(task.id, task.status);

          // Botón para eliminar tarea
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Eliminar';
          deleteButton.classList.add('delete-btn');
          deleteButton.onclick = () => eliminarTarea(task.id);

          // Agregar botones al contenedor
          buttonContainer.appendChild(toggleButton);
          buttonContainer.appendChild(deleteButton);

          // Agregar el texto de la tarea y el contenedor de botones al `li`
          li.appendChild(taskText);
          li.appendChild(buttonContainer);
          taskList.appendChild(li);
        });
      })
      .catch(error => console.error('Error al obtener tareas:', error));
}

  
  // Cambiar el estado de la tarea en el backend
  function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
  
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',  // Cambiar estado con PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(() => {
      console.log('Estado de la tarea actualizado');
      cargarTareas(); // Recargar las tareas
    })
    .catch(error => console.error('Error al actualizar estado:', error));
  }
  
  // Agregar tarea al backend
  function agregarTarea(task) {
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Tarea agregada:', data);
      cargarTareas(); // Recargar las tareas
    })
    .catch(error => console.error('Error al agregar tarea:', error));
  }
  
  // Eliminar tarea del backend
  function eliminarTarea(taskId) {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      console.log('Tarea eliminada');
      cargarTareas(); // Recargar las tareas
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
  }
  