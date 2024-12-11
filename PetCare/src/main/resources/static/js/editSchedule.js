let veterinarians = [];

document.addEventListener('DOMContentLoaded', async () => {
    const selectedScheduleId = localStorage.getItem('selectedScheduleId');

    if (selectedScheduleId) {
        try {
            const response = await fetch(`/rest/weeklyschedule/${selectedScheduleId}`);
            if (!response.ok) {
                throw new Error('Error fetching weekly schedule');
            }

            const data = await response.json();
            populateSchedule(data);

            await loadVeterinarians(data);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        await loadVeterinarians();
    }
});

function allowDrop(event) {
    event.preventDefault();
}

async function loadVeterinarians(scheduleData = { schedules: [] }) {
    try {
        const response = await fetch("http://localhost:8080/rest/clinic-staff/");
        if (!response.ok) {
            throw new Error("Error fetching veterinarians");
        }

        veterinarians = await response.json();

        const scheduledVetIds = new Set((scheduleData.schedules || []).map(schedule => schedule.clinicStaffId));
        veterinarians.filter(vet => !scheduledVetIds.has(vet.userId)).forEach(addVetToPanel);


    } catch (error) {
        console.error("Error loading veterinarians:", error);
    }
}

function populateSchedule(data) {
    const startDate = data.startDate;
    document.getElementById('schedule-title').textContent = `Edit Weekly Schedule for ${startDate}`;

    const schedules = data.schedules;
    const existingSchedule = {};
    const assignedVets = [];

    schedules.forEach(schedule => {
        const clinicStaffId = schedule.clinicStaffId;
        const clinicStaffName = schedule.clinicStaffName;
        const clinicStaffLastName = schedule.clinicStaffLastName;

        const dayOfWeek = new Date(schedule.date).getDay();
        const dayId = getDayId(dayOfWeek);
        const cell = document.getElementById(dayId);

        if (cell) {
            cell.innerHTML = `
                ${clinicStaffName} ${clinicStaffLastName} (ID: ${clinicStaffId})
                <button onclick="removeVetFromSlot('${dayId}', '${clinicStaffId}')" class="btn btn-danger btn-sm ms-2">x</button>`;
            cell.classList.add("slot-filled");
            cell.dataset.vetId = clinicStaffId;

            existingSchedule[dayId] = clinicStaffId;

            assignedVets.push({
                clinicStaffId,
                name: clinicStaffName,
                lastName: clinicStaffLastName,
                dayId
            });

            const existingVetCard = document.querySelector(`.vet-card[data-id='${clinicStaffId}']`);
            if (!existingVetCard) {
                const vet = {
                    userId: clinicStaffId,
                    name: clinicStaffName,
                    lastname: clinicStaffLastName
                };
                addVetToPanel(vet);
            }
        } else {
            console.error(`No se encontró el elemento para el día: ${dayId}`);
        }
    });

    localStorage.setItem("schedule", JSON.stringify(existingSchedule));

    localStorage.setItem("assignedVets", JSON.stringify(assignedVets));
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

function addVetToPanel(vet) {
    if (document.querySelector(`.vet-card[data-id='${vet.userId}']`)) return;

    const vetList = document.getElementById("vet-list");
    const vetCard = document.createElement("div");
    vetCard.className = "card vet-card";
    vetCard.draggable = true;
    vetCard.dataset.id = vet.userId;

    vetCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${vet.name} ${vet.lastname}</h5>
            <p class="card-text">ID: ${vet.userId}</p>
        </div>`;

    vetCard.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", vet.userId);
        setTimeout(() => vetCard.classList.add("dragging"), 0);
    };

    vetCard.ondragend = () => {
        vetCard.classList.remove("dragging");
    };

    vetList.appendChild(vetCard);
}

function getDayId(day) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[day];
}

async function deleteCurrentWeeklySchedule() {
    const selectedScheduleId = localStorage.getItem("selectedScheduleId");

    if (!selectedScheduleId) {
        console.error("No selected schedule ID found in localStorage.");
        return;
    }

    try {
        const response = await fetch(`/rest/weeklyschedule/${selectedScheduleId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete the weekly schedule.");
        }

        console.log("Weekly schedule deleted successfully.");
        localStorage.removeItem("selectedScheduleId");

    } catch (error) {
        console.error("Error deleting weekly schedule:", error);
    }
}

async function saveScheduleChanges() {
    const schedules = JSON.parse(localStorage.getItem("schedule"));
    const assignedVets = JSON.parse(localStorage.getItem("assignedVets"));

    if (!schedules || Object.keys(schedules).length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Schedule',
            text: 'The schedule cannot be saved because it is empty. Please assign veterinarians to the schedule first.'
        });
        return;
    }

    let schedulesToDelete = [];
    let schedulesToKeep = [];
    let schedulesToCreate = [];

    let scheduleData = Object.entries(schedules);
    const scheduleDataCopy = [...scheduleData];

    assignedVets.forEach(vet => {
        let exists = false;

        scheduleDataCopy.forEach(sch => {
            if (vet.clinicStaffId == sch[1] && vet.dayId == sch[0]) {
                exists = true;
                schedulesToKeep.push(sch);
                scheduleData = scheduleData.filter(item => item !== sch);
            }
        });

        if (!exists) {
            schedulesToDelete.push(vet);
        }
    });

    schedulesToCreate = [...scheduleData];

    try {
        if (schedulesToDelete.length > 0) {
            await deleteSchedules(schedulesToDelete);
        }

        if (schedulesToCreate.length > 0) {
            await createSchedules(schedulesToCreate);
        }

        Swal.fire({
            icon: 'success',
            title: 'Schedule modified',
            text: 'The schedule has been successfully saved.'
        }).then(() => {
            resetSchedule();
        });

    } catch (error) {
        console.error("Error saving schedule changes:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while saving the schedule changes.'
        });
    }
}


/*function getEarliestDay(scheduleData) {
    const daysOfWeek = {
        mon: 0,
        tue: 1,
        wed: 2,
        thu: 3,
        fri: 4,
        sat: 5
    };

    const earliestDay = scheduleData.reduce((earliest, current) => {
        const currentDay = current[0];
        const earliestDayValue = daysOfWeek[earliest[0]];
        const currentDayValue = daysOfWeek[currentDay];

        return currentDayValue < earliestDayValue ? current : earliest;
    });

    return [earliestDay[0], earliestDay[1]];
}*/


function deleteSchedules(schedulesToDelete) {
    const selectedScheduleId = localStorage.getItem("selectedScheduleId");

    if (!selectedScheduleId) {
        console.error("No selected schedule ID found in localStorage.");
        return Promise.resolve();
    }

    return fetch(`/rest/weeklyschedule/${selectedScheduleId}`, {
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to retrieve the weekly schedule.");
        }
        return response.json();
    }).then(data => {
        const deletePromises = schedulesToDelete.map(vet => {
            const date = getDateFromDayId(vet.dayId, data.startDate);
            const clinicStaffId = vet.clinicStaffId;

            return fetch(`http://localhost:8080/rest/schedule/delete/${date}/${clinicStaffId}`, { method: "DELETE" })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to delete the schedule.");
                    return fetch(`http://localhost:8080/rest/appointment/delete/${date}/${clinicStaffId}`, { method: "DELETE" });
                });
        });

        return Promise.all(deletePromises);
    }).catch(error => {
        console.error("Error deleting schedules:", error);
        return Promise.reject(error);
    });
}


function createSchedules(schedulesToCreate) {
    const selectedScheduleId = localStorage.getItem("selectedScheduleId");

    fetch(`/rest/weeklyschedule/${selectedScheduleId}`, {
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to retrieve the weekly schedule.");
        }
        return response.json();
    }).then(data => {
        schedulesToCreate.forEach(vet => {
            const date = getDateFromDayId(vet[0], data.startDate);
            const formattedDate = new Date(date).toISOString().split('T')[0];
            const clinicStaffId = parseInt(vet[1], 10);

            fetch(`http://localhost:8080/rest/schedule/assign?clinicStaffId=${clinicStaffId}&date=${formattedDate}`, {
                method: "POST"
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create the schedule.");
                }
                return response.json();
            }).then(responseJson => {
                const selectedScheduleId2 = parseInt(localStorage.getItem("selectedScheduleId"), 10);

                const weeklySchedule = {
                    weeklyScheduleId: selectedScheduleId2
                };


                return fetch(`http://localhost:8080/rest/schedule/update/${responseJson.id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(weeklySchedule)
                });
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update the schedule.");
                }

                return fetch(`http://localhost:8080/rest/appointment/create/${clinicStaffId}/${date}`, {
                    method: "POST"
                });
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create the appointment.");
                }
            }).catch(error => {
                console.error("Error creating schedule:", error);
            });
        });
    }).catch(error => console.error("Error fetching weekly schedule:", error));
}

function getMondayOfWeek(date) {
    const adjustedDate = new Date(date);
    const day = adjustedDate.getDay();
    if (day !== 0) {
        const diff = day === 0 ? -6 : -day;
        adjustedDate.setDate(adjustedDate.getDate() + diff);
    }
    return adjustedDate;
}

function getDateFromDayId(dayId, startDate) {
    const daysOffset = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5 };
    const offset = daysOffset[dayId];

    const baseDate = getMondayOfWeek(new Date(startDate));

    baseDate.setDate(baseDate.getDate() + offset);
    return baseDate.toISOString().split("T")[0];
}


function resetSchedule() {
    document.querySelectorAll(".schedule-cell").forEach(cell => {
        cell.classList.remove("slot-filled");
        cell.innerHTML = "";
        delete cell.dataset.vetId;
    });


    const vetList = document.getElementById("vet-list");
    if (vetList) {
        vetList.innerHTML = "";
        veterinarians.forEach(addVetToPanel);
    } else {
        console.warn("Element with ID 'vet-list' not found.");
    }
}