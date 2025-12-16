let selectedPriority = "Low";

function setPriority(value) {
  selectedPriority = value;

  document.querySelectorAll(".priority button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}

// ANNULATION (bouton X)
function cancelAdd() {
  window.location.href = "index.html"; // retour à la home
}

// CONFIRMATION D’AJOUT
async function addTask() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const token = localStorage.getItem('token');

    if (!name) {
        alert("Le nom est obligatoire");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                status: "In Progress"
            })
        });

        if (response.ok) {
            window.location.href = 'index.html'; // Retour accueil après ajout
        } else {
            alert("Erreur lors de l'ajout. Vérifiez votre connexion.");
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
}