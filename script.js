document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentList = document.getElementById('appointment-list');
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentSection = document.getElementById('add-appointment');
    const searchBar = document.getElementById('search-bar');
    const appointments = [];
    // Toggle form visibility
    addAppointmentBtn.addEventListener('click', function () {
        appointmentSection.style.display = appointmentSection.style.display === 'block' ? 'none' : 'block';
    });
    // Handle form submission
    appointmentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const patientName = document.getElementById('patient-name').value;
        const appointmentDate = document.getElementById('appointment-date').value;
        const appointmentTime = document.getElementById('appointment-time').value;
        const appointmentDuration = document.getElementById('appointment-duration').value;
        const appointmentReason = document.getElementById('appointment-reason').value;
        const appointmentStatus = document.getElementById('appointment-status').value;
        const appointmentPriority = document.getElementById('appointment-priority').value;
        // Create appointment object
        const appointment = {
            patientName,
            appointmentDate,
            appointmentTime,
            appointmentDuration,
            appointmentReason,
            appointmentStatus,
            appointmentPriority
        };
        // Add appointment to appointments array
        appointments.push(appointment);
        // Create appointment card
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card', `priority-${appointmentPriority}`);
        appointmentCard.innerHTML = `
            <h3>${patientName}</h3>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Duration:</strong> ${appointmentDuration} minutes</p>
            <p><strong>Reason:</strong> ${appointmentReason}</p>
            <p><strong>Status:</strong> ${appointmentStatus}</p>
            <p><strong>Priority:</strong> ${appointmentPriority}</p>
        `;
        // Add appointment to list
        appointmentList.appendChild(appointmentCard);
        // Clear form
        appointmentForm.reset();
    });
    // Search appointments
    searchBar.addEventListener('keyup', searchAppointments);
    function searchAppointments() {
        const filter = searchBar.value.toLowerCase();
        const appointmentCards = document.querySelectorAll('.appointment-card');
        appointmentCards.forEach(card => {
            const patientName = card.querySelector('h3').textContent.toLowerCase();
            if (patientName.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    // Check notification permission
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
    // Function to check for upcoming appointments
    function checkForUpcomingAppointments() {
        const now = new Date();
        appointments.forEach(appointment => {
            const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
            const timeDiff = (appointmentDateTime - now) / 1000 / 60; // Difference in minutes
            // If the time difference is exactly 10 minutes, show a notification
            if (timeDiff <= 10 && timeDiff > 9) {
                showNotification(appointment.patientName, appointment.appointmentTime);
            }
        });
    }
    // Show browser notification
    function showNotification(patientName, appointmentTime) {
        if (Notification.permission === "granted") {
            const notification = new Notification("Upcoming Appointment!", {
                body: `You have an appointment with ${patientName} at ${appointmentTime}`,
                icon: "https://icon-library.com/images/appointment-icon/appointment-icon-14.jpg"
            });
        }
    }
    // Check every minute for upcoming appointments
    setInterval(checkForUpcomingAppointments, 60000); // Check every minute
});
