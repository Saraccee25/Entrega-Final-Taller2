    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#userPassword');
    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const passwordConfirmInput = document.querySelector('#ConfirmPassword');

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            this.classList.remove('bi-eye');
            this.classList.add('bi-eye-slash');
        } else {
            this.classList.remove('bi-eye-slash');
            this.classList.add('bi-eye');
        }
    });

    toggleConfirmPassword.addEventListener('click', function () {
        const type = passwordConfirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordConfirmInput.setAttribute('type', type);

        if (type === 'text') {
            this.classList.remove('bi-eye');
            this.classList.add('bi-eye-slash');
        } else {
            this.classList.remove('bi-eye-slash');
            this.classList.add('bi-eye');
        }
    });

    function validatePasswordMatch() {
        const password = document.getElementById("userPassword").value;
        const confirmPassword = document.getElementById("ConfirmPassword").value;
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        if (password !== confirmPassword) {
            confirmPasswordError.style.display = "block";
            return false;
        }

        confirmPasswordError.style.display = "none";
        return true;
    }

    function validatePassword() {
        const password = document.getElementById("userPassword").value;
        const passwordError = document.getElementById("passwordError");

        const passwordRegex = /^(?=.[a-zA-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            passwordError.style.display = "block";
        } else {
            passwordError.style.display = "none";
        }
    }


    document.addEventListener('DOMContentLoaded', () => {
        loadClinicStaff();
    });

    function loadClinicStaff() {
        fetch('/rest/clinic-staff/')
            .then(response => response.json())
            .then(clinicStaffs => {
                const clinicStaffList = document.getElementById('veterinaryList');
                clinicStaffList.innerHTML = '';

                clinicStaffs.forEach(clinicStaff => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${clinicStaff.userId}</td>
                        <td>${clinicStaff.name}</td>
                        <td>${clinicStaff.lastname}</td>
                        <td>${clinicStaff.phoneNumber}</td>
                        <td>${clinicStaff.username}</td>
                        <td>
                            <button class="btn btn-warning" style="background-color: #95BDFF; border: none;"
                             onclick="editClinicStaff(${clinicStaff.userId})">Edit</button>
                            <button class="btn btn-danger" style="background-color: #F7C8E0; border: none;"
                             onclick="deleteClinicStaff(${clinicStaff.userId})">Delete</button>
                        </td>
                    `;
                    clinicStaffList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error loading veterinaries:', error);
                Swal.fire('Error', 'Could not load veterinaries.', 'error');
            });
    }


    document.getElementById('clinicStaffForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addClinicStaff();
    });

    function addClinicStaff() {
        const passwordError = document.getElementById("passwordError");
        const userId = document.getElementById('userId').value;
        const name = document.getElementById('name').value;
        const lastName = document.getElementById('userLastName').value;
        const phoneNumber = document.getElementById('userPhone').value;
        const userName = document.getElementById('userName').value;
        const password = document.getElementById('userPassword').value;

        const clinicStaff = {
            userId: userId,
            name: name,
            lastname: lastName,
            phoneNumber: phoneNumber,
            username: userName,
            password: password
        };

        fetch('/rest/clinic-staff/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clinicStaff)
        })
        .then(response => {
            if (response.ok) {
                loadClinicStaff();
                document.getElementById('clinicStaffForm').reset();
                passwordError.style.display = "none";
                Swal.fire('Success', 'Veterinary added successfully', 'success');
            } else {
                return response.json().then(error => {
                    throw new Error(error.message || 'Could not add veterinary.');
                });
            }
        })
        .catch(error => {
            console.error('Error adding veterinary:', error);
            Swal.fire('Error', error.message || 'Could not add veterinary.', 'error');
        });
    }


    function deleteClinicStaff(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to recover this veterinary!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/rest/clinic-staff/${id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        loadClinicStaff();
                        Swal.fire('Deleted!', 'Veterinary has been deleted.', 'success');
                    } else {
                        throw new Error('Error deleting veterinary.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting veterinary:', error);
                    Swal.fire('Error', error.message, 'error');
                });
            }
        });
    }

    function editClinicStaff(id) {
        localStorage.setItem('clinicStaffIdToEdit', id);
        window.location.href = 'http://localhost:8080/admin-panel/clinic-staff/edit';
    }
