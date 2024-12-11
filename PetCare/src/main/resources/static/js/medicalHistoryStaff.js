function loadMedicalHistory(petId) {
        loadPetName(petId);
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
                loadDiagnostics(medicalHistoryId);
                localStorage.setItem('idMedicalHistory', medicalHistory.id);
            })
            .catch(error => {
                console.error(error.message);
                alert(error.message);
            });
    }

    function loadDiagnostics(medicalHistoryId) {
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
        const container = document.getElementById('medicalHistoryContainer');
        container.innerHTML = '';
    
        if (!diagnostics || diagnostics.length === 0) {
            container.innerHTML = `<p>No diagnostic records available for this pet.</p>`;
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
                                <p><strong>Description for the diagnostic:</strong> ${diagnostic.description}</p>
                                <p><strong>Treatments:</strong></p>
                                <ul id="treatments-list-${diagnostic.id}"></ul>
                                <br>
                                <div id="recipe-${diagnostic.id}"></div>
                                <hr>
                            </div>
                        `).join('')}
                    </div>
                `;
            container.innerHTML += accordionHtml;
    
            dateDiagnostics.forEach(diagnostic => {
                loadTreatmentsForDiagnostic(diagnostic.id);
            });

            dateDiagnostics.forEach(diagnostic => {
                loadRecipeAndDoses(diagnostic);
            });
        }
    
        const accordions = document.getElementsByClassName("accordion");
        for (let i = 0; i < accordions.length; i++) {
            accordions[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                panel.style.display = panel.style.display === "block" ? "none" : "block";
            });
        }
    }

    function loadRecipeAndDoses(diagnostic) {
        if (diagnostic.recipe.id) {
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
                    recipeContainer.innerHTML = `<strong>Recipe:</strong><div>${dosesHtml.join('')}</div>`;
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

    function loadTreatmentsForDiagnostic(diagnosticId) {
        fetch(`/rest/treatments-diagnostics/${diagnosticId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error loading treatments for diagnostic.');
                }
                return response.json();
            })
            .then(treatments => {
                const treatmentsListContainer = document.getElementById(`treatments-list-${diagnosticId}`);
                treatmentsListContainer.innerHTML = treatments.map(treatment => `
                    <li>${treatment.name}</li>
                `).join('');
            })
            .catch(error => {
                console.error('Error loading treatments:', error.message);
                const treatmentsListContainer = document.getElementById(`treatments-list-${diagnosticId}`);
                treatmentsListContainer.innerHTML = '<li>No treatments available for this diagnostic.</li>';
            });
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
                    <strong>${medication.name}</strong>
                    <div class="medication-list-dose">
                        <strong>Amount:</strong> ${dose.amount}
                    </div>
                    <div class="medication-list-dose">
                        <strong>Description:</strong> ${dose.description}
                    </div>
                </li>
            `;
            })
            .catch(error => {
                console.error(error.message);
                return `<li>No medication details available.</li>`;
            });
    }

    function loadPetName(petId) {
            fetch(`/rest/pets/${petId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Pet not found.');
                    }
                    return response.json();
                })
                .then(pet => {
                    const title = document.getElementById('medicalHistoryTitle');
                    title.textContent = `Medical History - ${pet.name} ${pet.lastname}`;
                })
                .catch(error => {
                    console.error(error.message);
                    alert(error.message);
                });
        }

    window.onload = function() {
        const petId = localStorage.getItem('selectedPetId');
        if (petId) {
            loadMedicalHistory(petId);
        } else {
            alert('No pet ID found.');
        }
    };