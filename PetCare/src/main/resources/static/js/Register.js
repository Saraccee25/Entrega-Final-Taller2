function togglePasswordVisibility() {
    const passwordInput = document.getElementById("floatingPassword");
    const passwordIcon = document.getElementById("togglePasswordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
    }
}

function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById("floatingConfirmPassword");
    const confirmPasswordIcon = document.getElementById("toggleConfirmPasswordIcon");

    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        confirmPasswordIcon.classList.remove("fa-eye");
        confirmPasswordIcon.classList.add("fa-eye-slash");
    } else {
        confirmPasswordInput.type = "password";
        confirmPasswordIcon.classList.remove("fa-eye-slash");
        confirmPasswordIcon.classList.add("fa-eye");
    }
}

function validatePasswordMatch() {
    const password = document.getElementById("floatingPassword").value;
    const confirmPassword = document.getElementById("floatingConfirmPassword").value;
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    if (password !== confirmPassword) {
        confirmPasswordError.classList.add("text-danger-element");
        confirmPasswordError.style.display = "block";
        return false;
    }

    confirmPasswordError.style.display = "none";
    return true;
}

function validatePassword() {
    const password = document.getElementById("floatingPassword").value;
    const username = document.getElementById("floatingUsername").value;
    const passwordError = document.getElementById("passwordError");

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        passwordError.classList.add("text-danger-element");
        passwordError.style.display = "block";
        return false;
    }

    if (username === password) {
        passwordError.classList.add("text-danger-element");
        passwordError.style.display = "block";
        passwordError.textContent = "Username cannot be the same as the password.";
        return false;
    }

    passwordError.style.display = "none";
    return true;
}

function validateField(value, errorElementId, errorMessage) {
    const errorElement = document.getElementById(errorElementId);
    if (!value) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add("text-danger-element");
        errorElement.style.display = "block";
        return false;
    } else {
        errorElement.style.display = "none";
        return true;
    }
}

document.getElementById('clientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userId = document.getElementById('floatingIdNumber').value.trim();
    const name = document.getElementById('floatingName').value.trim();
    const lastname = document.getElementById('floatingLastname').value.trim();
    const phoneNumber = document.getElementById('floatingPhoneNumber').value.trim();
    const username = document.getElementById('floatingUsername').value.trim();

    let isValid = true;
    isValid &= validateField(userId, "userIdError", "Id Number is required");
    isValid &= validateField(name, "nameError", "Name is required");
    isValid &= validateField(lastname, "lastnameError", "Lastname is required");
    isValid &= validateField(phoneNumber, "phoneNumberError", "Phone Number is required");
    isValid &= validateField(username, "usernameError", "Username is required");
    isValid &= validatePassword() && validatePasswordMatch();

    if (!isValid) {
        return;
    }

    const formData = {
        userId,
        name,
        lastname,
        phoneNumber,
        username,
        password: document.getElementById('floatingPassword').value
    };

    try {
        const response = await fetch('http://localhost:8080/rest/client/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.status === 500) {
            throw new Error('Existing user');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Success:', data);
        Swal.fire('Success', 'Created user.', 'success');
        
        await sleep(2000);
        window.location.href = "http://localhost:8080/public/login";
        
    } catch (error) {
        if (error.message === 'Existing user') {
            Swal.fire('Error', 'Existing user.', 'error');
        } else {
            console.error('Error submitting the form:', error);
        }
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
