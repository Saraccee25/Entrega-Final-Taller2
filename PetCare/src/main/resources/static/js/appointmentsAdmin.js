    window.onload = function() {
        const petId = localStorage.getItem('selectedPetId');
        if (petId) {
            loadAppointments(petId);
        } else {
            alert('No pet ID found.');
        }
    };

    function loadPetName(petId) {
        fetch(`/rest/pets/${petId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pet not found.');
            }
            return response.json();
        })
        .then(pet => {
            const title = document.getElementById('appointmentTitle');
            title.textContent = `Appointments - ${pet.name} ${pet.lastname}`;
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
    }

    function loadAppointments(petId){
        loadPetName(petId);

        fetch(`/rest/appointment/pet/${petId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Medical history for the pet was not found.');
            }
            return response.json();
        })
        .then(appointment => {
            displayAppointments(appointment);
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
    }


    function displayAppointments(appointments) {
        const container = document.getElementById('medicalHistoryContainer');
        container.innerHTML = '';

        if (!appointments || appointments.length === 0) {
            container.innerHTML = `<p>No appointments records for this pet.</p>`;
            return;
        }

        appointments.sort((a, b) => new Date(a.date) - new Date(b.date));

        const currentDay = new Date().toLocaleDateString('en-US', {
             timeZone: 'UTC',
             year: 'numeric',
             month: '2-digit',
             day: '2-digit'
        });
        const groupedAppointments = {};
        appointments.forEach(appointment => {
            const date = new Date(appointment.date).toLocaleDateString('en-US', {
                timeZone: 'UTC',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            console.log(currentDay);
            console.log(date);
            if( currentDay <= date){
                if (!groupedAppointments[date]) {
                    groupedAppointments[date] = [];
                }
                groupedAppointments[date].push(appointment);
            }
        });

        for (const date in groupedAppointments) {

            const dateAppointment = groupedAppointments[date];
            const accordionHtml = `
                <button class="accordion">${date}</button>
                    <div class="panel">
                        ${dateAppointment.map(appointment => `
                            <div id="appointment-${appointment.id}">
                                <p><strong>Appointment Time: </strong> ${appointment.startTime}</p>
                                <p><strong>Veterinary Name: </strong> ${appointment.clinicStaff.name} ${appointment.clinicStaff.lastname}</p>
                                <br>
                                <p><strong>Client Information</strong></p>
                                <div class="client-information">
                                    <p><strong>Name: </strong> ${appointment.pet.client.name} ${appointment.pet.client.lastname}</p>
                                    <p><strong>Phone: </strong> ${appointment.pet.client.phoneNumber}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            container.innerHTML += accordionHtml;
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