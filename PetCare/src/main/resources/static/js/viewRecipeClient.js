document.addEventListener("DOMContentLoaded", () => {
    loadPets();
});

function loadPets() {
    const userIdElement = document.querySelector("#userId span");
    const userId = userIdElement ? userIdElement.textContent.trim() : null;
    const petSelect = document.getElementById("petSelect");

    if (userId) {
        sessionStorage.setItem("userId", userId);
    }

    if (userId) {
        fetch(`http://localhost:8080/rest/client/pets/${userId}`)
            .then(response => response.json())
            .then(pets => {
                pets.forEach(pet => {
                    const option = document.createElement("option");
                    option.value = pet.id;
                    option.textContent = `${pet.name} ${pet.lastname}`;
                    petSelect.appendChild(option);
                });
            })
            .catch(error => console.error("Error fetching pets:", error));
    } else {
        console.error("User ID not found");
    }

    petSelect.addEventListener("change", () => {
        const petId = petSelect.value;
        if (petId) {
            searchMedicalHistory(petId);
        }
    });
}


function searchMedicalHistory(petId) {
    fetch(`/rest/medical-histories/pet/${petId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Medical history for the pet was not found.');
            }
            return response.json();
        })
        .then(medicalHistory => {
            console.log("Medical History:", medicalHistory);
            const medicalHistoryId = medicalHistory.id;
            searchDiagnostics(medicalHistoryId);
            localStorage.setItem('idMedicalHistory', medicalHistory.id);
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
}


function searchDiagnostics(medicalHistoryId) {
    fetch(`/rest/diagnostics/history/${medicalHistoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No diagnostic records found for this medical history.');
            }
            return response.json();
        })
        .then(diagnostics => {
            console.log("Diagnostics:", diagnostics);
            displayDiagnostics(diagnostics);
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
}


function displayDiagnostics(diagnostics) {
    const container = document.getElementById('recipesContainer');
    container.innerHTML = '';

    if (!diagnostics || diagnostics.length === 0) {
        container.innerHTML = `<p>No recipes records available for this pet.</p>`;
        return;
    }

    diagnostics.sort((a, b) => new Date(b.date) - new Date(a.date));

    const groupedDiagnostics = {};
    diagnostics.forEach(diagnostic => {
        const date = new Date(diagnostic.date).toLocaleDateString('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        if (!groupedDiagnostics[date]) {
            groupedDiagnostics[date] = [];
        }
        groupedDiagnostics[date].push(diagnostic);
    });

    for (const date in groupedDiagnostics) {
        const dateDiagnostics = groupedDiagnostics[date];
        const accordionHtml = `
            <button class="accordion">${date}</button>
            <div class="panel">
                ${dateDiagnostics.map(diagnostic => `
                    <div id="diagnostic-${diagnostic.id}">
                        <div id="recipe-${diagnostic.id}"></div>
                        <div class="download-container">
                            <button class="download-btn" onclick="downloadDatePDF('${date}')">Download PDF</button>
                        </div>
                        <hr>
                    </div>
                `).join('')}
            </div>
        `;
        container.innerHTML += accordionHtml;

        dateDiagnostics.forEach(diagnostic => {
            loadRecipeAndDoses(diagnostic);
        });
    }

    const accordions = document.getElementsByClassName("accordion");
    for (let i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        });
    }
}


function loadRecipeAndDoses(diagnostic) {
    if (diagnostic.recipe && diagnostic.recipe.id) {
        fetch(`/rest/dose/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error loading doses.');
                }
                return response.json();
            })
            .then(allDoses => {
                const recipeDoses = allDoses.filter(dose => dose.recipe.id === diagnostic.recipe.id);
                return Promise.all(recipeDoses.map(dose => loadDoseAndMedication(dose)));
            })
            .then(dosesHtml => {
                const recipeContainer = document.getElementById(`recipe-${diagnostic.id}`);
                recipeContainer.innerHTML = `<strong>Recipe Doses:</strong><ul>${dosesHtml.join('')}</ul>`;
            })
            .catch(error => {
                console.error(error.message);
                const recipeContainer = document.getElementById(`recipe-${diagnostic.id}`);
                recipeContainer.innerHTML = `<p>No recipe details available.</p>`;
            });
    } else {
        const recipeContainer = document.getElementById(`recipe-${diagnostic.id}`);
        recipeContainer.innerHTML = `<p>No recipe associated with this diagnostic.</p>`;
    }
}

function loadDoseAndMedication(dose) {
    return fetch(`/rest/medications/${dose.medication.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Medication not found.');
            }
            return response.json();
        })
        .then(medication => {
            return `
            <li>
                <div id="dose-${dose.id}" class="medication-list-dose">
                    <strong class="medication-name">${medication.name}</strong>
                    <div class="medication-list-dose">
                        <strong>Amount:</strong> <span class="medication-amount">${dose.amount}</span>
                    </div>
                    <div class="medication-list-dose">
                        <strong>Description:</strong> <span class="medication-description">${dose.description}</span>
                    </div>
                </div>
            </li>
        `;
        })
        .catch(error => {
            console.error(error.message);
            return `<li>No medication details available.</li>`;
        });
}

