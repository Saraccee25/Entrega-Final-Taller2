const dateInput = document.getElementById('vaccineDate');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

document.addEventListener("DOMContentLoaded", function () {
    const medicationSelect = document.getElementById("medicationSelect");

    async function loadMedications() {
        try {
            const response = await fetch("/rest/medications/");
            if (!response.ok) {
                throw new Error("Failed to fetch medications");
            }
            const medications = await response.json();

            const vaccines = medications.filter(medication => medication.vaccine);

            medicationSelect.innerHTML = `<option value="">Select Vaccine</option>`;
            vaccines.forEach(vaccine => {
                const option = document.createElement("option");
                option.value = vaccine.id;
                option.textContent = vaccine.name;
                medicationSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading medications:", error);
        }
    }

    loadMedications();

    async function loadVaccinationCard(petId) {
        loadPetName(petId);
        try {
            const response = await fetch(`/rest/vaccination-cards/pets/${petId}`);
            if (!response.ok) {
                throw new Error('Vaccination card for the pet was not found.');
            }
            const vaccinationCard = await response.json();
            const vaccinationCardId = vaccinationCard.id;
            loadVaccines(vaccinationCardId);
            localStorage.setItem('idVaccinationCard', vaccinationCardId);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }

  async function loadVaccines(vaccinationCardId) {
          try {
              const response = await fetch(`/rest/vaccines/byVaccinationCard/${vaccinationCardId}`);
              if (!response.ok) {
                  throw new Error('No vaccines records found for this vaccination card.');
              }
              const vaccines = await response.json();
              displayVaccines(vaccines);
          } catch (error) {
              console.error(error.message);
              displayVaccines([]);
          }
      }

      function displayVaccines(vaccines) {
          const container = document.getElementById('vaccinationCardContainer');
          container.innerHTML = '';

          if (!vaccines || vaccines.length === 0) {

              container.innerHTML = `
                  <p class="text-muted text-center" style="font-size: 1.2rem; padding: 20px;">
                      No vaccination records available for this card.
                  </p>`;
              return;
          }


          vaccines.sort((a, b) => new Date(b.date) - new Date(a.date));
          vaccines.forEach(vaccine => {
              const date = new Date(vaccine.date).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
              });

              const vaccineCard = `
                  <hr>
                  <div class="card mb-3">
                      <div class="card-body">
                          <h5 class="card-title">${vaccine.medication.name}</h5>
                          <p class="card-text"><strong>Date:</strong> ${date}</p>
                          <p class="card-text"><strong>Dose:</strong> ${vaccine.dose} ml</p>
                      </div>
                  </div>
              `;
              container.innerHTML += vaccineCard;
          });
      }

    async function loadPetName(petId) {
        try {
            const response = await fetch(`/rest/pets/${petId}`);
            if (!response.ok) {
                throw new Error('Pet not found.');
            }
            const pet = await response.json();
            const title = document.getElementById('vaccinationCardTitle');
            title.textContent = `Vaccination Records - ${pet.name} ${pet.lastname}`;
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    }

    async function validateDuplicateVaccine(vaccineId, vaccinationDate) {
        try {
            const vaccinationCardId = localStorage.getItem('idVaccinationCard');

            const response = await fetch(`/rest/vaccines/byVaccinationCard/${vaccinationCardId}`);
            if (!response.ok) {
                throw new Error('Error fetching vaccination records.');
            }
            const vaccines = await response.json();

            const existingVaccine = vaccines.find(vaccine =>
                new Date(vaccine.date).toLocaleDateString() === new Date(vaccinationDate).toLocaleDateString() &&
                vaccine.medication.id === parseInt(vaccineId)
            );

            return existingVaccine ? true : false;
        } catch (error) {
            console.error("Error validating vaccine:", error);
            return false;
        }
    }

    function resetForm() {
        document.getElementById('vaccineDate').value = today;
        document.getElementById('vaccineDose').value = '';
        document.getElementById('medicationSelect').value = '';
    }

    window.onload = function () {
        const petId = localStorage.getItem('selectedPetId');
        if (petId) {
            loadVaccinationCard(petId);
        } else {
            alert('No pet ID found.');
        }
    };

document.getElementById('saveVaccineButton').addEventListener('click', async function () {
    const vaccineDate = document.getElementById('vaccineDate').value;
    const vaccineDose = 1;
    const medicationId = document.getElementById('medicationSelect').value;

    if (!vaccineDate || !medicationId) {
        Swal.fire('Error', 'Please fill in all required fields.', 'error');
        return;
    }

    const isDuplicate = await validateDuplicateVaccine(medicationId, vaccineDate);

    if (isDuplicate) {
        Swal.fire('Error', 'This vaccine has already been registered on this date.', 'error');
        return;
    }

    const vaccinationCardId = localStorage.getItem('idVaccinationCard');

    try {
        const stockResponse = await fetch(`/rest/medications/decrement-stock/${medicationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!stockResponse.ok) {
            const errorMessage = await stockResponse.text();
            throw new Error(`Stock update failed: ${errorMessage}`);
        }

        const vaccineData = {
            date: vaccineDate,
            dose: vaccineDose,
            medication: {
                id: medicationId
            }
        };

        const response = await fetch(`/rest/vaccines/${vaccinationCardId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vaccineData)
        });

        if (!response.ok) {
            throw new Error('Failed to add vaccine');
        }

        Swal.fire('Success', 'Vaccine added successfully!', 'success');
        loadVaccines(vaccinationCardId);
        resetForm();
        const modal = bootstrap.Modal.getInstance(document.getElementById('vaccinationModal'));
        modal.hide();
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', error.message, 'error');
    }
});

    document.getElementById('vaccinationModal').addEventListener('hidden.bs.modal', resetForm);
});

document.getElementById('downloadPdfButton').addEventListener('click', async function () {
    const petId = localStorage.getItem('selectedPetId');
    if (!petId) {
        Swal.fire('Error', 'No pet ID found.', 'error');
        return;
    }

    try {
        const response = await fetch(`/rest/vaccination-cards/pets/${petId}`);
        if (!response.ok) throw new Error('Vaccination card for the pet was not found.');
        const vaccinationCard = await response.json();

        const petResponse = await fetch(`/rest/pets/${petId}`);
        if (!petResponse.ok) throw new Error('Pet not found.');
        const pet = await petResponse.json();

        const vaccinesResponse = await fetch(`/rest/vaccines/byVaccinationCard/${vaccinationCard.id}`);
        if (!vaccinesResponse.ok) throw new Error('No vaccination records found for this pet.');

        let vaccines = [];
        try {
            vaccines = await vaccinesResponse.json();
        } catch (error) {
            Swal.fire(
                'No Vaccination Records',
                'There are no registered vaccines for this pet. Please update the records and try again.',
                'info'
            );
            return;
        }

        if (vaccines.length === 0) {
            Swal.fire(
                'No Vaccination Records',
                'There are no registered vaccines for this pet. Please update the records and try again.',
                'info'
            );
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const colors = {
            pink: "#F7C8E0",
            green: "#DFFFD8",
            lightBlue: "#B4E4FF",
            blue: "#95BDFF",
            lightPurple: "#B1AFFF"
        };

        pdf.setFillColor(colors.blue);
        pdf.rect(0, 0, 210, 35, 'F');

        const logoUrl = '/img/logo.png';
        const logoX = 8, logoY = 8, logoWidth = 20, logoHeight = 20;
        const logoImage = new Image();
        logoImage.src = logoUrl;

        logoImage.onload = function () {
            pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(20);
            pdf.setTextColor('#000000');
            pdf.text(`Vaccination Card`, 105, 15, { align: 'center' });

            pdf.setFontSize(14);
            pdf.text(`PetCare Veterinary Clinic`, 105, 25, { align: 'center' });

            pdf.setFontSize(12);
            pdf.setTextColor('#000000');

            pdf.setFont("helvetica", "bold");
            pdf.text(`Pet:`, 10, 50);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${pet.name} ${pet.lastname}`, 30, 50);

            pdf.setFont("helvetica", "bold");
            pdf.text(`Owner:`, 10, 60);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${pet.client.name} ${pet.client.lastname}`, 30, 60);

            pdf.setFont("helvetica", "bold");
            pdf.text(`Generated on:`, 10, 70);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${new Date().toLocaleDateString()}`, 40, 70);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text(`Vaccines:`, 10, 80);

            let yPosition = 90;
            vaccines.sort((a, b) => new Date(b.date) - new Date(a.date));
            vaccines.forEach(vaccine => {
                const date = new Date(vaccine.date).toLocaleDateString('en-US', {
                    timeZone: 'UTC',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                pdf.setFillColor(colors.lightBlue);
                pdf.rect(10, yPosition - 5, 190, 10, 'F');

                pdf.setFontSize(12);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor('#000000');
                pdf.text(`- ${vaccine.medication.name}`, 12, yPosition);

                pdf.setFont("helvetica", "normal");
                pdf.text(`Date: ${date}`, 70, yPosition);
                pdf.text(`Dose: ${vaccine.dose} ml`, 140, yPosition);

                yPosition += 15;
            });

            pdf.save(`${pet.name}_Vaccination_Card.pdf`);
        };

        logoImage.onerror = function () {
            Swal.fire('Error', 'Unable to load the logo image.', 'error');
        };

    } catch (error) {
        console.error('Error generating PDF:', error);
        Swal.fire('Error', error.message, 'error');
    }
});





