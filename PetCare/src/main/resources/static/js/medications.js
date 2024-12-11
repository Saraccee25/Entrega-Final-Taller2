document.addEventListener('DOMContentLoaded', () => {
    loadMedications();

});

function loadMedications() {
    fetch('/rest/medications/')
        .then(response => response.json())
        .then(medications => {
            const medicationList = document.getElementById('medicationList');
            medicationList.innerHTML = '';

            if (medications.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="text-center">No medications registered</td>
                `;
                medicationList.appendChild(row);
            } else {
                medications.forEach(medication => {
                    const formattedPrice = 'COP ' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(medication.unitPrice);

                    const row = document.createElement('tr');
                    if (medication.stock === 0) {
                        row.classList.add('table-danger');
                    }
                    row.innerHTML = `
                        <td>${medication.id}</td>
                        <td>${medication.name}</td>
                        <td>${formattedPrice}</td>
                        <td>${medication.stock}</td>
                        <td>
                            <button class="btn btn-warning" style="background-color: #95BDFF; border: none;"
                             onclick="editMedication(${medication.id})">Edit</button>
                            <button class="btn btn-danger" style="background-color: #F7C8E0; border: none;"
                             onclick="deleteMedication(${medication.id})">Delete</button>
                        </td>
                    `;
                    medicationList.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error loading medications:', error);
            Swal.fire('Error', 'Could not load medications.', 'error');
        });
}

document.getElementById('medicationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addMedication();
});

function addMedication() {
    const name = document.getElementById('medicationName').value;
    const unitPrice = parseInt(document.getElementById('medicationPrice').value);
    const stock = parseInt(document.getElementById('medicationStock').value);
    const isVaccine = document.getElementById('isVaccine').checked;
    const medication = {
        name: name,
        unitPrice: unitPrice,
        stock: stock,
        vaccine: isVaccine
    };

    fetch('/rest/medications/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(medication)
    })
    .then(response => {
        if (response.ok) {
            loadMedications();
            document.getElementById('medicationForm').reset();
            Swal.fire('Success', 'Medication added successfully', 'success');
        } else {
            return response.json().then(error => {
                throw new Error(error.message || 'Could not add medication.');
            });
        }
    })
    .catch(error => {
        console.error('Error adding medication:', error);
        Swal.fire('Error', error.message || 'Could not add medication.', 'error');
    });
}



function deleteMedication(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this medication!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/rest/medications/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    loadMedications();
                    Swal.fire('Deleted!', 'Medication has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting medication.');
                }
            })
            .catch(error => {
                console.error('Error deleting medication:', error);
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
}

function editMedication(id) {
    localStorage.setItem('medicationIdToEdit', id);
    window.location.href = 'http://localhost:8080/admin-panel/medications/edit';
}
