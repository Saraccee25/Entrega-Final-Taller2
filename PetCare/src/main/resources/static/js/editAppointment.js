document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#dateSelect", {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            updateAvailableAppointments(dateStr);
        }
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

            card.innerHTML = `
                <div class="card-body">
                    <p class="card-text"><strong>Date:</strong>
                        <input type="date" id="date-${appointment.id}" value="${appointment.date}" class="form-control">
                    </p>
                    <p class="card-text"><strong>Appointment Time:</strong>
                        <select id="appointmentTime-${appointment.id}" class="form-control">
                            <option value="" disabled selected>Select a time</option>
                        </select>
                    </p>
                    <p class="card-text"><strong>Veterinarian:</strong>
                        <input type="text" id="clinicStaff-${appointment.id}" value="${appointment.clinicStaff ? `${appointment.clinicStaff.name} ${appointment.clinicStaff.lastname}` : 'N/A'}"  class="form-control" readonly>
                    </p>
                    <button class="btn btn-primary" onclick="updateAppointment(${appointment.id}, ${petId})">Update</button>
                </div>
            `;

            appointmentsContainer.appendChild(card);

            const dateInput = document.getElementById(`date-${appointment.id}`);
            dateInput.addEventListener('change', function () {
                loadAvailableAppointments(appointment.id, appointment.clinicStaff.userId, dateInput.value, appointment.startTime, appointment.endTime); // Cambiar la fecha
            });


            loadAvailableAppointments(appointment.id, appointment.clinicStaff.userId, appointment.date,appointment.startTime, appointment.endTime);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}


async function loadAvailableAppointments(appointmentId, clinicStaffId, date, startTime, endTime) {
    try {
        const response = await fetch(`/rest/appointment/appointments/available?clinicStaffId=${clinicStaffId}&date=${date}`);
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const appointments = await response.json();
            const availableAppointments = appointments.filter(appointment => appointment.available);
            const appointmentSelect = document.getElementById(`appointmentTime-${appointmentId}`);
            appointmentSelect.innerHTML = '';

                const option = document.createElement('option');
                option.value = `${startTime} - ${endTime}`;
                option.textContent = `${startTime} - ${endTime}`;
                option.selected = true;
                appointmentSelect.appendChild(option);

            availableAppointments.forEach(available => {
                    const option = document.createElement('option');
                    option.value = `${available.startTime} - ${available.endTime}`;
                    option.textContent = `${available.startTime} - ${available.endTime}`;
                    appointmentSelect.appendChild(option);

            });
        } else {
            console.error("Error: La respuesta no es JSON.");
        }
    } catch (error) {
        console.error('Error fetching available appointments:', error);
    }
}

    async function updateAppointment(appointmentId, petId) {
        event.preventDefault();

        const date = document.getElementById(`date-${appointmentId}`).value;
        const appointmentTime = document.getElementById(`appointmentTime-${appointmentId}`).value;

        if (!date || !appointmentTime) {
            Swal.fire("Error", "Date and Appointment Time are required.", "error");
            return;
        }

        const [startTime, endTime] = appointmentTime.split(' - ');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to update this appointment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    const url = new URL(`/rest/appointment/update/${appointmentId}`, window.location.origin);
                    url.searchParams.append('date', date);
                    url.searchParams.append('startTime', startTime);
                    if (petId) {
                        url.searchParams.append('petId', petId);
                    }

                    const response = await fetch(url.toString(), {
                        method: 'PUT',
                    });

                    if (response.ok) {
                        Swal.fire(
                            'Updated!',
                            'The appointment has been updated successfully.',
                            'success'
                        );
                        loadAppointmentsByPetId(petId);

                        const notificationUrl = new URL(`/rest/notifications/reprogrammed/${appointmentId}`, window.location.origin);
                        notificationUrl.searchParams.append('date', date);
                        notificationUrl.searchParams.append('startTime', startTime);
                        if (petId) {
                            notificationUrl.searchParams.append('petId', petId);
                        }

                        fetch(notificationUrl.toString(), {
                            method: 'POST',
                        }).then(notificationResponse => {
                            if (notificationResponse.ok) {
                                console.log('Notification sent successfully.');
                            } else {
                                console.error('Error sending notification.');
                            }
                        }).catch(error => {
                            console.error('Error making notification request:', error);
                        });

                    } else {
                        const error = await response.text();
                        Swal.fire(
                            'Error!',
                            `Failed to update appointment: ${error}`,
                            'error'
                        );
                    }
                } catch (error) {
                    console.error('Error updating appointment:', error);
                    Swal.fire(
                        'Error!',
                        'There was an error updating the appointment.',
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
                    option.textContent = `${pet.name}`;
                    petSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        } else {
            console.error("User ID not found");
        }
    }

    window.updateAppointment = updateAppointment;
});
