    document.addEventListener('DOMContentLoaded', () => {
    const clinicStaffId = localStorage.getItem('clinicStaffIdToEdit');
    if (clinicStaffId) {
        loadClinicStaff(clinicStaffId);
    }

    document.getElementById('clinicStaffForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateClinicStaff(clinicStaffId);
        }
    });
    });


    function validateForm() {
    const userId = document.getElementById('userId').value.trim();
    const name = document.getElementById('name').value.trim();
    const userLastName = document.getElementById('userLastName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const userName = document.getElementById('userName').value.trim();

    console.log(userLastName)
    if (!userId || !name || !userLastName || !userPhone || !userName) {
        Swal.fire({
            title: 'Warning!',
            text: 'All fields are required!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return false;
    }

    return true;
    }


    function loadClinicStaff(id) {
    fetch(`/rest/clinic-staff/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(clinicStaff => {
            document.getElementById('userId').value = clinicStaff.userId || '';
            document.getElementById('name').value = clinicStaff.name || '';
            document.getElementById('userLastName').value = clinicStaff.lastname || '';
            document.getElementById('userPhone').value = clinicStaff.phoneNumber || '';
            document.getElementById('userName').value = clinicStaff.username || '';
        })
        .catch(error => console.error('Error loading veterinary:', error));
    }


    function updateClinicStaff(id) {
    const userId = document.getElementById('userId').value.trim();
    const name = document.getElementById('name').value.trim();
    const userLastName = document.getElementById('userLastName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const userName = document.getElementById('userName').value.trim();

    const clinicStaff = {
        userId: userId,
        name: name,
        lastname: userLastName,
        phoneNumber: userPhone,
        username: userName
    };

    fetch(`/rest/clinic-staff/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clinicStaff)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Veterinary updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('clinicStaffIdToEdit');
                window.location.href = 'http://localhost:8080/admin-panel/clinic-staff';
            });
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the veterinary.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('Error updating veterinary:', error);
    });
    }
