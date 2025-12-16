const API_URL = "http://localhost:5000/api/tasks";
const token = localStorage.getItem('token');

// Fonction pour charger et afficher les tâches
async function loadTasks() {
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` } // Correction : Ajout de Bearer
        });

        if (!res.ok) {
            console.error("Erreur d'autorisation ou serveur :", res.status);
            return;
        }

        const tasks = await res.json();

        // Correction : On vérifie que tasks est bien un tableau (Array)
        if (!Array.isArray(tasks)) {
            console.error("Format de données invalide reçu du serveur");
            return;
        }

        const inProgressList = document.getElementById('in-progress-list');
        const completedList = document.getElementById('completed-list');
        
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach(task => {
            // Correspondance avec tes statuts MongoDB ("Completed" ou "In Progress")
            const isCompleted = task.status === 'Completed';

            const html = `
                <div class="task-card ${isCompleted ? 'task-done' : ''}">
                    <div class="task-content">
                        <h4>${task.name}</h4>
                        <p>${task.description || ''}</p>
                    </div>
                    <div class="task-actions">
                        <button onclick="toggleStatus('${task._id}', '${task.status}')">
                            ${isCompleted ? '↩️' : '✅'}
                        </button>
                        <button onclick="deleteTask('${task._id}')">🗑️</button>
                    </div>
                </div>
            `;

            if (isCompleted) {
                completedList.innerHTML += html;
            } else {
                inProgressList.innerHTML += html;
            }
        });
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

// Changer le statut (In Progress <-> Completed)
async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        loadTasks();
    } catch (err) {
        console.error("Erreur update status:", err);
    }
}

// Supprimer une tâche
async function deleteTask(id) {
    if(confirm("Supprimer définitivement cette tâche ?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadTasks();
        } catch (err) {
            console.error("Erreur delete:", err);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadTasks);