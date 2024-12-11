flatpickr("#dateSelect", {
    dateFormat: "Y-m-d",
    minDate: "today",
});

document.addEventListener("DOMContentLoaded", function () {
    const petSelect = document.getElementById("petSelect");

    fetch('http://localhost:8080/rest/pets/')
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

        petSelect.addEventListener("change", function () {
            dateSelect.value = "";
            loadAppointmentsForPet();
        });

        dateSelect.addEventListener("change", function () {
            petSelect.value = "";
            loadAppointmentsForDate();
        });
});


const appointmentsContainer = document.querySelector(".appointments .row");
const messageContainer = document.createElement("div");
messageContainer.style.backgroundColor = "#f8d7da";
messageContainer.style.color = "#721c24";
messageContainer.style.border = "1px solid #f5c6cb";
messageContainer.style.borderRadius = "5px";
messageContainer.style.padding = "10px";
messageContainer.style.marginBottom = "10px";
messageContainer.style.display = "none";
appointmentsContainer.parentNode.insertBefore(messageContainer, appointmentsContainer);

const userIdElement = document.querySelector("#userId span");
const userId = userIdElement ? userIdElement.textContent.trim() : null;

if (userId) {
    console.log(userId);
    sessionStorage.setItem("userId", userId);
}

function loadAppointmentsForDate() {
    const vetId = userId;
    const date = dateSelect.value;

    if (vetId && date) {

        fetch(`/rest/appointment/appointments/available?clinicStaffId=${vetId}&date=${date}`)
            .then(response => response.json())
            .then(appointments => {
                appointmentsContainer.innerHTML = "";
                messageContainer.innerHTML = "";

                const confirmedAppointments = appointments.filter(appointment => !appointment.available);

                if (confirmedAppointments.length === 0) {
                    messageContainer.innerHTML = "<p>No appointments on this date.</p>";
                    messageContainer.style.display = "block";
                } else {
                    messageContainer.style.display = "none";
                    confirmedAppointments.forEach(appointment => {
                        const card = document.createElement("div");
                        card.classList.add("col-md-4", "mb-4");

                        const cardBody = document.createElement("div");
                        cardBody.classList.add("card", "shadow-sm");

                        const cardHeader = document.createElement("div");
                        cardHeader.classList.add("card-header");
                        cardHeader.style.backgroundColor = "var(--color-light-blue)";
                        cardHeader.textContent = "Appointment Time";


                        const cardContent = document.createElement("div");
                        cardContent.classList.add("card-body");

                        const formattedStartTime = appointment.startTime.substring(0, 5);
                        const formattedEndTime = appointment.endTime.substring(0, 5);
                        cardContent.innerHTML = `<h5 class="card-title">Time: ${formattedStartTime} - ${formattedEndTime}</h5>`;
                        cardContent.innerHTML += `<h6 class="card-text">Pet Name: ${appointment.pet.name} ${appointment.pet.lastname}</h6>`;

                        cardBody.appendChild(cardHeader);
                        cardBody.appendChild(cardContent);
                        card.appendChild(cardBody);

                        appointmentsContainer.appendChild(card);
                    });
                }
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }
}


function loadAppointmentsForPet() {
    const vetId = userId;
    const petId = petSelect.value;

    if (vetId && petId) {

        fetch(`/rest/appointment/pets/available?clinicStaffId=${vetId}&petId=${petId}`)
        .then(response => response.json())
        .then(appointments => {
            appointmentsContainer.innerHTML = "";
            messageContainer.innerHTML = "";

            if(appointments.length === 0){
                messageContainer.innerHTML = "<p>No appointments for this pet.</p>";
                messageContainer.style.display = "block";
            }else{
                messageContainer.style.display = "none";
                appointments.forEach(appointment => {
                    const card = document.createElement("div");
                    card.classList.add("col-md-4", "mb-4");

                    const cardBody = document.createElement("div");
                    cardBody.classList.add("card", "shadow-sm");

                    const cardHeader = document.createElement("div");
                    cardHeader.classList.add("card-header");
                    cardHeader.style.backgroundColor = "var(--color-light-blue)";
                    cardHeader.textContent = "Appointment";


                    const cardContent = document.createElement("div");
                    cardContent.classList.add("card-body");

                    const formattedStartTime = appointment.startTime.substring(0, 5);
                    const formattedEndTime = appointment.endTime.substring(0, 5);
                    cardContent.innerHTML += `<h5 class="card-title">Date: ${appointment.date}</h5>`;
                    cardContent.innerHTML += `<h6 class="card-text">Time: ${formattedStartTime} - ${formattedEndTime}</h6>`;
                    cardContent.innerHTML += `<h6 class="card-text">Pet Name: ${appointment.pet.name} ${appointment.pet.lastname}</h6>`;

                    cardBody.appendChild(cardHeader);
                    cardBody.appendChild(cardContent);
                    card.appendChild(cardBody);

                    appointmentsContainer.appendChild(card);
                });
            }

        })
        .catch(error => console.error("Error fetching appointments:", error));
    }
}
