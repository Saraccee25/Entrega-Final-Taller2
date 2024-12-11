document.addEventListener("DOMContentLoaded", function () {

    flatpickr("#dateSelect", {
        dateFormat: "Y-m-d",
        minDate: "today",
    });

    loadClients();

    document.getElementById('clientSelect').addEventListener('change', function () {
        const userId = this.value;
        loadPets(userId);
    });

    const petSelect = document.getElementById('petSelect');
    petSelect.addEventListener('change', function () {
        const petId = this.value;
        loadAppointmentsByPetId(petId);
    });

    async function loadAppointmentsByPetId(petId) {
        try {
            const response = await fetch(`http://localhost:8080/rest/appointment/pet/${petId}`);
            const appointments = await response.json();
            const appointmentsContainer = document.getElementById('appointmentsContainer');

            appointmentsContainer.innerHTML = '';

            if (appointments.length === 0) {
                appointmentsContainer.innerHTML = `
                            <div class="alert alert-info" role="alert">
                                <p>No appointments assigned for this pet.</p>
                            </div>
                        `;
                return;
            }

            appointments.forEach(appointment => {
                const card = document.createElement('div');
                card.className = 'card mb-3 card-custom';

                const veterinarianName = appointment.clinicStaff
                    ? `${appointment.clinicStaff.name} ${appointment.clinicStaff.lastname}`
                    : 'N/A';

                card.innerHTML = `
                    <div class="card-body">
                        <p class="card-text"><strong>Date:</strong> ${appointment.date}</p>
                        <p class="card-text"><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
                        <p class="card-text"><strong>Veterinary:</strong> ${veterinarianName}</p>
                        <button class="btn btn-danger" onclick="deleteAppointment('${appointment.date}', '${appointment.startTime}', ${appointment.pet.id})">Delete</button>
                    </div>
                `;

                appointmentsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }

    async function deleteAppointment(date, startTime, petId) {
        event.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/rest/appointment/delete/${date}/${startTime}/${petId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'The appointment has been deleted.',
                            'success'
                        );
                        loadAppointmentsByPetId(petId);
                        await fetch(`http://localhost:8080/rest/notifications/appointment-cancelled/${date}/${startTime}/${petId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    } else {
                        Swal.fire(
                            'Error!',
                            'There was an error deleting the appointment.',
                            'error'
                        );
                    }
                } catch (error) {
                    console.error('Error deleting appointment:', error);
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the appointment.',
                        'error'
                    );
                }
            }
        });
    }

    async function loadClients() {
        try {
            const response = await fetch('http://localhost:8080/rest/client/');
            const clients = await response.json();

            const clientSelect = document.getElementById('clientSelect');
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.userId;
                option.textContent = `${client.name} ${client.lastname}, ID: ${client.userId}`;
                clientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }

    async function loadPets(userId) {
        const petSelect = document.getElementById('petSelect');
        petSelect.innerHTML = '<option value="" selected disabled>Select a pet...</option>';

        if (userId) {
            try {
                const response = await fetch(`http://localhost:8080/rest/client/pets/${userId}`);
                const pets = await response.json();

                pets.forEach(pet => {
                    const option = document.createElement('option');
                    option.value = pet.id;
                    option.textContent = `${pet.name} ${pet.lastname}`;
                    petSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        } else {
            console.error("User ID not found");
        }
    }

    window.deleteAppointment = deleteAppointment;

});
