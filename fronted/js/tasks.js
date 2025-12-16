const API_URL = "http://localhost:5000/api/tasks";
const token = localStorage.getItem('token');

async function loadTasks(filter = 'all') {
    if (!token) { window.location.href = "login.html"; return; }

    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const tasks = await res.json();
        console.log("Tasks reçues:", tasks); // Pour vérifier dans la console F12

        // --- CALCUL DES COMPTEURS ---
        const total = tasks.length;
        const inProgressCount = tasks.filter(t => t.status !== 'Completed').length;
        const completedCount = tasks.filter(t => t.status === 'Completed').length;

        // --- MISE À JOUR DU DOM (Vérifie bien ces IDs) ---
        const elAll = document.getElementById('count-all');
        const elTodo = document.getElementById('count-progress');
        const elDone = document.getElementById('count-completed');

        if (elAll) elAll.innerText = total;
        if (elTodo) elTodo.innerText = inProgressCount;
        if (elDone) elDone.innerText = completedCount;

        // --- GESTION VISUELLE DE LA SIDEBAR ---
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        // On cherche l'élément cliqué pour ajouter le point blanc
        const activeItem = document.querySelector(`.nav-item[onclick="loadTasks('${filter}')"]`);
        if (activeItem) activeItem.classList.add('active');

        // --- AFFICHAGE DES LISTES ---
        const inProgressList = document.getElementById('in-progress-list');
        const completedList = document.getElementById('completed-list');
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const isCompleted = task.status === 'Completed';
            // Filtrage logique
            if (filter === 'todo' && isCompleted) return;
            if (filter === 'done' && !isCompleted) return;

            const html = `
                <div class="task-card">
                    <div class="task-content">
                        <h4 style="${isCompleted ? 'text-decoration: line-through; color: #777;' : ''}">${task.name}</h4>
                        <p>${task.description || ''}</p>
                    </div>
                    <div class="task-actions">
                        <button class="btn-action" onclick="toggleStatus('${task._id}', '${task.status}')">
                            ${isCompleted ? '↩️' : '✅'}
                        </button>
                        <button class="btn-action" onclick="deleteTask('${task._id}')">🗑️</button>
                    </div>
                </div>`;

            if (isCompleted) completedList.innerHTML += html;
            else inProgressList.innerHTML += html;
        });
    } catch (error) {
        console.error("Erreur loadTasks:", error);
    }
}

async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    await fetch(`${API_URL}/${id}/status`, { // Correction de l'URL
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
    });
    loadTasks();
}

async function deleteTask(id) {
    if(confirm("Supprimer ?")) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadTasks();
    }
}

document.addEventListener('DOMContentLoaded', loadTasks);