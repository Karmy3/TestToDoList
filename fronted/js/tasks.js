const API_URL = "http://localhost:5000/api/tasks";
const token = localStorage.getItem('token');

async function loadTasks() {
    if (!token) { window.location.href = "login.html"; return; }

    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403 || res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = "login.html";
            return;
        }

        const tasks = await res.json();
        const inProgressList = document.getElementById('in-progress-list');
        const completedList = document.getElementById('completed-list');
        
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            const isCompleted = task.status === 'Completed';
            const html = `
                <div class="task-card ${isCompleted ? 'task-done' : ''}">
                    <div class="task-content">
                        <h4>${task.name}</h4>
                        <p>${task.description || ''}</p>
                        <small>Priority: ${task.priority}</small>
                    </div>
                    <div class="task-actions">
                        <button onclick="toggleStatus('${task._id}', '${task.status}')">
                            ${isCompleted ? '↩️' : '✅'}
                        </button>
                        <button onclick="deleteTask('${task._id}')">🗑️</button>
                    </div>
                </div>
            `;
            if (isCompleted) completedList.innerHTML += html;
            else inProgressList.innerHTML += html;
        });
    } catch (error) { console.error("Erreur réseau :", error); }
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