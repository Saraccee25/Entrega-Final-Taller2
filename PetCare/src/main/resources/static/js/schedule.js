window.onload = function() {
    localStorage.clear();
};

const vetList = document.getElementById("vet-list");
let veterinarians = [];

async function loadVeterinarians() {
    try {
        const response = await fetch("http://localhost:8080/rest/clinic-staff/");
        if (!response.ok) {
            throw new Error("Error fetching veterinarians");
        }
        veterinarians = await response.json();
        veterinarians.forEach(addVetToPanel);
    } catch (error) {
        console.error("Error loading veterinarians:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadVeterinarians);

function addVetToPanel(vet) {
    const vetCard = document.createElement("div");
    vetCard.className = "card vet-card";
    vetCard.draggable = true;
    vetCard.dataset.id = vet.userId;

    vetCard.innerHTML =
        `<div class="card-body">
            <h5 class="card-title">${vet.name} ${vet.lastname}</h5>
            <p class="card-text">ID: ${vet.userId}</p>
        </div>`;

    vetCard.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", vet.userId); // Usar userId
        setTimeout(() => vetCard.classList.add("dragging"), 0);
    };

    vetCard.ondragend = () => {
        vetCard.classList.remove("dragging");
    };

    vetList.appendChild(vetCard);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const vetId = event.dataTransfer.getData("text/plain");
    const slot = event.target;

    if (slot.classList.contains("schedule-cell")) {
        const vet = veterinarians.find(v => v.userId == vetId);
        if (vet) {
            if (slot.classList.contains("slot-filled")) {
                return;
            }

            slot.classList.add("slot-filled");
            slot.innerHTML = `${vet.name} ${vet.lastname}<br>ID: ${vet.userId} <button onclick="removeVetFromSlot('${slot.id}')" class="btn btn-danger btn-sm ms-2">x</button>`;
            slot.dataset.vetId = vetId;

            const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
            schedule[slot.id] = vetId;
            localStorage.setItem("schedule", JSON.stringify(schedule));
        }
    } else {
        const vet = veterinarians.find(v => v.userId == vetId);
        if (vet && !document.querySelector(`.vet-card[data-id='${vetId}']`)) {
            addVetToPanel(vet);
        }
    }
}

function removeVetFromSlot(slotId) {
    const slot = document.getElementById(slotId);
    const vetId = slot.dataset.vetId;
    if (vetId) {
        const vet = veterinarians.find(v => v.userId == vetId);
        slot.classList.remove("slot-filled");
        slot.innerHTML = "";
        delete slot.dataset.vetId;

        const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
        delete schedule[slot.id];
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }
}

async function checkWeekAvailability(startDate) {

    const startDateStr = startDate.toISOString().slice(0, 10);

    const response = await fetch(`http://localhost:8080/rest/weeklyschedule/check-week?startDate=${startDateStr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error checking week availability: ${errorText}`);
    }

    const weekOccupied = await response.json();
    return weekOccupied.weekOccupied;
}

async function generateSchedule() {
    const schedule = JSON.parse(localStorage.getItem("schedule"));

    if (schedule && Object.keys(schedule).length > 0) {
        const mondayDateStr = document.getElementById("monday-picker").value;

        const mondayDate = new Date(mondayDateStr);

        try {
            const weekOccupied = await checkWeekAvailability(mondayDate);

            if (weekOccupied) {
                Swal.fire({
                    icon: 'error',
                    title: 'Week Already Occupied',
                    text: 'The selected week already has a schedule. Please choose another week.'
                });
                return;
            }

            const requests = [];
            const schedules = [];

            for (const [slotId, vetId] of Object.entries(schedule)) {
                const date = getDateForSlot(slotId);

                const request = fetch(`http://localhost:8080/rest/schedule/assign?clinicStaffId=${vetId}&date=${date}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                requests.push(request);
            }

            const responses = await Promise.all(requests);

            await Promise.all(responses.map(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                const scheduleResult = await response.json();
                schedules.push(scheduleResult);
            }));

            schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

            const weeklySchedule = { schedules: schedules };

            const weeklyScheduleResponse = await fetch(`http://localhost:8080/rest/weeklyschedule/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(weeklySchedule)
            });

            if (!weeklyScheduleResponse.ok) {
                const errorText = await weeklyScheduleResponse.text();
                throw new Error(`Error creating WeeklySchedule: ${weeklyScheduleResponse.status} - ${errorText}`);
            }

            const weeklyScheduleResult = await weeklyScheduleResponse.json();

            for (const schedule of schedules) {
                const updateResponse = await fetch(`http://localhost:8080/rest/schedule/update/${schedule.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weeklyScheduleId: weeklyScheduleResult.id })
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.error(`Error updating schedule ${schedule.id}: ${errorText}`);
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Schedule Generated',
                text: 'The schedule has been successfully generated and saved.'
            });

            resetSchedule();
            localStorage.removeItem("schedule");
        } catch (error) {
            console.error("Error generating schedules:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to generate the schedule: ${error.message}`
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'No Schedules',
            text: 'There are no schedules to generate.'
        });
    }
}

function resetSchedule() {
    document.querySelectorAll(".schedule-cell").forEach(cell => {
        cell.classList.remove("slot-filled");
        cell.innerHTML = "";
        delete cell.dataset.vetId;
    });

    const dateInput = document.getElementById("monday-picker");
    dateInput.value = "";

    vetList.innerHTML = "";
    veterinarians.forEach(addVetToPanel);
}

function updateSchedule() {
    const dateInput = document.getElementById("monday-picker");
    const today = new Date();

    let nextMonday = new Date(today);
    nextMonday.setUTCHours(0, 0, 0, 0);

    const dayOfWeek = today.getUTCDay();

    if (dayOfWeek === 0) {
        nextMonday.setUTCDate(today.getUTCDate() + 1);
    } else if (dayOfWeek === 1) {
        nextMonday = today;
    } else {
        nextMonday.setUTCDate(today.getUTCDate() + (8 - dayOfWeek));
    }

    dateInput.min = nextMonday.toISOString().split('T')[0];

    dateInput.oninput = function () {
        const inputDate = new Date(this.value);

        if (isNaN(inputDate.getTime()) || inputDate < nextMonday) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date',
                text: 'You cannot select a past date! Please select a valid Monday.'
            });
            this.setCustomValidity("You cannot select a past date.");
            this.reportValidity();
            this.value = '';
        } else if (inputDate.getUTCDay() !== 1) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Day',
                text: 'Please select a Monday.'
            });
            this.setCustomValidity("Please select a Monday.");
            this.reportValidity();
            this.value = '';
        } else {
            this.setCustomValidity("");
        }
    };

    console.log(`Schedule will start on: ${nextMonday}`);
}


function getDateForSlot(slotId) {
    const dateInput = document.getElementById("monday-picker");
    const mondayDate = new Date(dateInput.value);

    mondayDate.setMinutes(mondayDate.getMinutes() + mondayDate.getTimezoneOffset());

    const slotDate = new Date(mondayDate);

    const daysAfterMonday = {
        'mon': 0,
        'tue': 1,
        'wed': 2,
        'thu': 3,
        'fri': 4,
        'sat': 5,
    };

    slotDate.setDate(slotDate.getDate() + daysAfterMonday[slotId]);

    return formatDate(slotDate);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function clearLocalStorageAndRedirect() {
    localStorage.clear();
    window.location.href = 'http://localhost:8080/admin-panel/indexSchedule';
}

document.querySelectorAll(".schedule-cell").forEach(cell => {
    cell.addEventListener("drop", drop);
    cell.addEventListener("dragover", allowDrop);
});

document.addEventListener("DOMContentLoaded", function() {
        flatpickr("#monday-picker", {
            locale: "en",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr, instance) {
                updateSchedule();
            }
        });
    });