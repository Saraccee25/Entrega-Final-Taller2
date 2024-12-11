if (reminder.length > 0) {
    const today = new Date().toISOString().split("T")[0];

    const notificationMessages = reminder
        .filter(notification => notification.reminder === null || notification.reminder === today)
        .map(notification => {
            const isTodayReminder = notification.reminder === today;
            return `
                <li>
                    ${notification.message}
                    ${!isTodayReminder ? "" : "<small>(Already reminded today)</small>"}
                </li>`;
        })
        .join("");

    if (notificationMessages) {
        Swal.fire({
            title: "Appointment Reminders",
            html: `<ul>${notificationMessages}</ul>`,
            icon: "info",
            showCancelButton: reminder.some(n => n.reminder === null),
            confirmButtonText: "Confirm Reminder",
            cancelButtonText: "Remind Me Tomorrow"
        }).then(async result => {
            if (result.isConfirmed) {
                for (const notification of reminder.filter(n => n.reminder === null || n.reminder === today)) {
                    await deleteNotification(notification.id);
                }
                Swal.fire("Confirmed!", "Your reminders have been marked as read.", "success");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                for (const notification of reminder.filter(n => n.reminder === null)) {
                    await updateReminder(notification.id);
                }
                Swal.fire("Noted!", "We will remind you tomorrow.", "info");
            }
        });
    }
}

async function deleteNotification(notificationId) {
    try {
        const response = await fetch(`http://localhost:8080/rest/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Failed to delete notification ${notificationId}`);
        } else {
            console.log(`Notification ${notificationId} deleted successfully`);
        }
    } catch (error) {
        console.error(`Error deleting notification ${notificationId}:`, error);
    }
}

async function updateReminder(notificationId) {
    try {
        const response = await fetch(`/rest/notifications/${notificationId}/update-reminder`, {
            method: "PATCH"
        });

        if (!response.ok) {
            console.error(`Failed to update reminder for notification ${notificationId}`);
        }
    } catch (error) {
        console.error(`Error updating reminder for notification ${notificationId}:`, error);
    }
}
