window.onload = loadWeeklySchedules;

async function loadWeeklySchedules() {
    try {
        const response = await fetch('http://localhost:8080/rest/weeklyschedule/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weeklySchedules = await response.json();
        displayWeeklySchedules(weeklySchedules);
    } catch (error) {
        console.error('Error fetching weekly schedules:', error);
        document.getElementById('weekly-schedules-list').innerHTML = '<p>Error loading schedules. Please try again later.</p>';
    }
}

function displayWeeklySchedules(weeklySchedules) {
    const listContainer = document.getElementById('weekly-schedules-list');
    listContainer.innerHTML = '';

    weeklySchedules.forEach(schedule => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'weekly-schedule-item mb-5';

        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-center mb-3';
        header.innerHTML = `
            <h5>Weekly Schedule for <span class="text-primary">${schedule.startDate}</span></h5>
            <button class="btn btn-sm" style="background-color: #F7C8E0; color: white;" onclick="editWeeklySchedule(${schedule.id}, ${JSON.stringify(schedule.schedules.map(s => s.id))})">Edit Schedule</button>
        `;
        scheduleItem.appendChild(header);

        const table = document.createElement('table');
        table.className = 'table table-bordered schedule-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>8 AM - 9 PM</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Monday')}</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Tuesday')}</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Wednesday')}</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Thursday')}</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Friday')}</td>
                    <td class="schedule-cell">${getVeterinarianNames(schedule.schedules, 'Saturday')}</td>
                </tr>
            </tbody>
        `;
        scheduleItem.appendChild(table);
        listContainer.appendChild(scheduleItem);
    });
}

function editWeeklySchedule(scheduleId, scheduleIds) {
    localStorage.setItem('selectedScheduleId', scheduleId);
    localStorage.setItem('scheduleIds', JSON.stringify(scheduleIds));
    window.location.href = '/admin-panel/editSchedule';
}

function getVeterinarianNames(schedules, day) {
    const dayMap = {
        'Monday': 0,
        'Tuesday': 1,
        'Wednesday': 2,
        'Thursday': 3,
        'Friday': 4,
        'Saturday': 5
    };

    const weekdaySchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getDay() === dayMap[day];
    });

    if (weekdaySchedules.length > 0) {
        return weekdaySchedules.map(schedule =>
            `<strong>${schedule.clinicStaffName} ${schedule.clinicStaffLastName} (ID: ${schedule.clinicStaffId})</strong>`).join(', ');
    } else {
        return `<span style="color: #cccccc;">No scheduled</span>`;
    }
}


