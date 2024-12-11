document.addEventListener("DOMContentLoaded", function () {
    const notificationBadge = document.querySelector('.notification-badge');
    const notificationList = document.querySelector('.dropdown-menu');
    const notificationDropdown = document.querySelector('.dropdown-toggle');

    function getTimeElapsed(dateString, timeString) {
        const notificationDate = new Date(dateString + 'T' + timeString);
        const now = new Date();
        const seconds = Math.floor((now - notificationDate) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const elapsed = Math.floor(seconds / secondsInUnit);
            if (elapsed > 1) return `${elapsed} ${unit}s ago`;
            if (elapsed === 1) return `1 ${unit} ago`;
        }
        return 'a few seconds ago';
    }

    function updateNotificationCount() {
        const notifications = document.querySelectorAll('.dropdown-menu li[id^="notification-"]');
        const notificationCount = notifications.length;

        if (notificationCount > 0) {
            notificationBadge.style.display = 'block';
            notificationBadge.textContent = notificationCount;
            const noNotificationMessageElement = document.querySelector('.dropdown-menu .no-notifications');
            if (noNotificationMessageElement) {
                noNotificationMessageElement.remove(); 
            }
        } else {
            notificationBadge.style.display = 'none';
            if (!document.querySelector('.dropdown-menu .no-notifications')) {
                const noNotificationMessageElement = document.createElement('li');
                noNotificationMessageElement.classList.add('no-notifications');
                noNotificationMessageElement.innerHTML = `<a class="dropdown-item" href="#">No notifications</a>`;
                notificationList.appendChild(noNotificationMessageElement);
            }
        }
    }

    function initializeTimeElapsed() {
        document.querySelectorAll('.time-elapsed').forEach(span => {
            const date = span.getAttribute('data-date');
            const time = span.getAttribute('data-time');
            span.textContent = getTimeElapsed(date, time);
        });
    }

    notificationList.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('close-btn')) {
            const notificationElement = event.target.closest('li');
            if (notificationElement) {
                const notificationId = notificationElement.getAttribute('data-id');
                notificationElement.remove();
                deleteNotification(notificationId);
                updateNotificationCount();
                event.stopPropagation();
            }
        }
    });

    if (notificationDropdown) {
        notificationDropdown.addEventListener('click', function (event) {
            const notifications = document.querySelectorAll('.dropdown-menu li[id^="notification-"]');
            if (notifications.length === 0) {
                event.stopPropagation();
            }
        });
    }

    notificationList.addEventListener('click', function (event) {
        if (event.target && !event.target.classList.contains('close-btn') && event.target.closest('li')) {
            const notificationElement = event.target.closest('li');
            const notificationMessage = notificationElement.querySelector('strong').innerText;

            Swal.fire({
                title: 'Notification Details',
                html: `
                    <strong>Message.</strong><br> ${notificationMessage} 
                    
                `,
                icon: 'info'
            });
        }
    });

    initializeTimeElapsed();
    updateNotificationCount();
});

async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`http://localhost:8080/rest/notifications/${notificationId}/mark-as-read`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ readState: false })
        });

        if (!response.ok) {
            console.error(`Failed to update notification ${notificationId}`);
        }
    } catch (error) {
        console.error(`Error updating notification ${notificationId}:`, error);
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

