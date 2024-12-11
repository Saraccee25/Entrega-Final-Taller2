document.addEventListener('DOMContentLoaded', () => {
    const medicationId = localStorage.getItem('medicationIdToEdit');
    if (medicationId) {
        loadMedication(medicationId);
    }

    document.getElementById('medicationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateMedication(medicationId);
        }
    });
});


function validateForm() {
    const medicationName = document.getElementById('medicationName').value.trim();
    const medicationPrice = document.getElementById('medicationPrice').value.trim();
    const medicationStock = document.getElementById('medicationStock').value.trim();

    console.log(medicationPrice)
    if (!medicationName || !medicationPrice || !medicationStock) {
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


function loadMedication(id) {
    fetch(`/rest/medications/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(medication => {
            document.getElementById('medicationName').value = medication.name || '';
            document.getElementById('medicationPrice').value = medication.unitPrice || '';
            document.getElementById('medicationStock').value = medication.stock || '';
        })
        .catch(error => console.error('Error loading medication:', error));
}


function updateMedication(id) {
    const name = document.getElementById('medicationName').value.trim();
    const unitPrice = parseInt(document.getElementById('medicationPrice').value.trim());
    const stock = parseInt(document.getElementById('medicationStock').value.trim());

    const medication = {
        name: name,
        unitPrice: unitPrice,
        stock: stock
    };

    fetch(`/rest/medications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(medication)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Medication updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('medicationIdToEdit');
                window.location.href = 'http://localhost:8080/admin-panel/medications';
            });
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the medication.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('Error updating medication:', error);
    });
}
