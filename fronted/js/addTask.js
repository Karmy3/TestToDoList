let selectedPriority = "Low";

function setPriority(value) {
    selectedPriority = value;
    document.querySelectorAll(".priority button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
}

function cancelAdd() { window.location.href = "index.html"; }

async function addTask() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const token = localStorage.getItem('token');

    if (!name) return alert("Le nom est obligatoire");

    const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            description,
            priority: selectedPriority,
            status: "In Progress"
        })
    });

    if (response.ok) window.location.href = 'index.html';
    else alert("Erreur lors de l'ajout.");
}