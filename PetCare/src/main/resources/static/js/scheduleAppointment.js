document.addEventListener("DOMContentLoaded", function () {
    const veterinarianSelect = document.getElementById("veterinarianSelect");
    const dateSelect = document.getElementById("dateSelect");
    const appointmentsContainer = document.querySelector(".appointments .row");
    const messageContainer = document.createElement("div");

    const userIdElement = document.querySelector("#userId span");
    const userId = userIdElement ? userIdElement.textContent.trim() : null;

    if (userId) {
        console.log(userId);
        sessionStorage.setItem("userId", userId);
    }

    const petSelect = document.getElementById("petSelect");

    messageContainer.style.backgroundColor = "#f8d7da";
    messageContainer.style.color = "#721c24";
    messageContainer.style.border = "1px solid #f5c6cb";
    messageContainer.style.borderRadius = "5px";
    messageContainer.style.padding = "10px";
    messageContainer.style.marginBottom = "10px";
    messageContainer.style.display = "none";
    appointmentsContainer.parentNode.insertBefore(messageContainer, appointmentsContainer);
    let veterinarians = [];

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

    fetch("http://localhost:8080/rest/clinic-staff/")
        .then(response => response.json())
        .then(data => {
            veterinarians = data;
            loadAvailableVeterinarians();
        });

    veterinarianSelect.addEventListener("change", loadAppointments);
    dateSelect.addEventListener("change", loadAvailableVeterinarians);

    function loadAvailableVeterinarians() {
        const date = dateSelect.value;
        veterinarianSelect.innerHTML = "";
        messageContainer.innerHTML = "";

        if (date) {
            Promise.all(veterinarians.map(vet =>
                fetch(`/rest/appointment/appointments/available?clinicStaffId=${vet.userId}&date=${date}`)
                    .then(response => response.json())
                    .then(appointments => {
                        if (appointments.length > 0) {
                            const option = document.createElement("option");
                            option.value = vet.userId;
                            option.textContent = `${vet.name} ${vet.lastname}`;
                            veterinarianSelect.appendChild(option);
                        }
                    })
            )).then(() => {
                if (veterinarianSelect.innerHTML === "") {
                    messageContainer.innerHTML = "<p>No veterinarians available for this date.</p>";
                    messageContainer.style.display = "block";
                    appointmentsContainer.innerHTML = "";
                } else {
                    messageContainer.style.display = "none";
                    loadAppointments();
                }
            });
        } else {
            veterinarians.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.userId;
                option.textContent = `${vet.name} ${vet.lastname}`;
                veterinarianSelect.appendChild(option);
            });
            messageContainer.style.display = "none";
        }
    }

    function loadAppointments() {
        const vetId = veterinarianSelect.value;
        const date = dateSelect.value;

        if (vetId && date) {
            fetch(`/rest/appointment/appointments/available?clinicStaffId=${vetId}&date=${date}`)
                .then(response => response.json())
                .then(appointments => {
                    appointmentsContainer.innerHTML = "";
                    messageContainer.innerHTML = "";

                    const limitedAppointments = appointments.slice(0, 26);

                    if (limitedAppointments.length === 0) {
                        messageContainer.innerHTML = "<p>No appointments available for this veterinarian on this date.</p>";
                        messageContainer.style.display = "block";
                    } else {
                        messageContainer.style.display = "none";
                        const table = document.createElement("table");
                        table.className = "table table-striped";

                        const thead = document.createElement("thead");
                        const headerRow = document.createElement("tr");
                        const timeHeader = document.createElement("th");
                        timeHeader.textContent = "Time";
                        headerRow.appendChild(timeHeader);
                        const actionHeader = document.createElement("th");
                        actionHeader.textContent = "Action";
                        headerRow.appendChild(actionHeader);
                        thead.appendChild(headerRow);
                        table.appendChild(thead);

                        const tbody = document.createElement("tbody");
                        limitedAppointments.forEach(appointment => {
                            const row = document.createElement("tr");

                            const appointmentDateTime = new Date(`${date}T${appointment.startTime}`);
                            const now = new Date();

                            const formattedStartTime = appointment.startTime.substring(0, 5);
                            const formattedEndTime = appointment.endTime.substring(0, 5);

                            const timeCell = document.createElement("td");
                            timeCell.textContent = `${formattedStartTime} - ${formattedEndTime}`;
                            timeCell.style.color = "#555";
                            row.appendChild(timeCell);

                            const actionCell = document.createElement("td");
                            const assignButton = document.createElement("button");
                            assignButton.className = "btn";
                            assignButton.style.backgroundColor = "#95BDFF";
                            assignButton.style.color = "#fff";
                            assignButton.textContent = "Assign appointment";

                            assignButton.style.transition = "background-color 0.3s";
                            assignButton.onmouseover = () => {
                                assignButton.style.backgroundColor = "#7DA8E1";
                            };
                            assignButton.onmouseout = () => {
                                assignButton.style.backgroundColor = "#95BDFF";
                            };

                            if (!appointment.available || appointmentDateTime < now) {
                                timeCell.style.backgroundColor = "#f8d7da";
                                timeCell.style.color = "#721c24";
                                actionCell.style.backgroundColor = "#f8d7da";
                                assignButton.disabled = true;
                                assignButton.textContent = "Not available";
                            } else {
                                assignButton.onclick = (event) => {
                                    event.preventDefault();
                                    assignAppointment(appointment.id);
                                };
                            }
                            actionCell.appendChild(assignButton);
                            row.appendChild(actionCell);

                            tbody.appendChild(row);
                        });
                        table.appendChild(tbody);
                        appointmentsContainer.appendChild(table);
                    }
                });
        }
    }



    function assignAppointment(appointmentId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to book this appointment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, book it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8080/rest/appointment/book/${appointmentId}/${petSelect.value}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(errorMessage => {
                                throw new Error(errorMessage);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Appointment assigned successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            loadAppointments();
                            location.reload();
                        });
                        fetch(`/rest/notifications/${userId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Error',
                            text: error.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    }

});

flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
    minDate: "today",
});
