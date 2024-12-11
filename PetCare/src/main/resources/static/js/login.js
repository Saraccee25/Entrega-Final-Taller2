function togglePasswordVisibility() {
        const passwordField = document.getElementById("password");
        const passwordIcon = document.getElementById("togglePasswordIcon");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            passwordIcon.classList.remove("fa-eye");
            passwordIcon.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            passwordIcon.classList.remove("fa-eye-slash");
            passwordIcon.classList.add("fa-eye");
        }
    }

    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('error')) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'The username or password you entered is incorrect.',
                confirmButtonText: 'Try Again'
            });
        }
    };

    function validateForm() {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
    
        const usernameError = document.getElementById("usernameError");
        const passwordError = document.getElementById("passwordError");
    
        let isValid = true;
    
        if (!username) {
            usernameError.style.display = "block";
            isValid = false;
        } else {
            usernameError.style.display = "none";
        }
    
        if (!password) {
            passwordError.style.display = "block";
            isValid = false;
        } else {
            passwordError.style.display = "none";
        }
    
        if (isValid) {
            document.getElementById("loginForm").submit();
        }
    }
    