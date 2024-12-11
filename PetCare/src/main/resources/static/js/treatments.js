document.addEventListener('DOMContentLoaded', () => {
    loadTreatments();

    document.getElementById('treatmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addTreatment();
    });

});


function loadTreatments() {
    fetch('/rest/treatments/')
        .then(response => response.json())
        .then(treatments => {
            const treatmentList = document.getElementById('treatmentList');
            treatmentList.innerHTML = '';

            treatments.forEach(treatment => {
                const formattedPrice = 'COP ' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(treatment.price);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${treatment.id}</td>
                    <td>${treatment.name}</td>
                    <td>${formattedPrice}</td>
                    <td>
                        <button class="btn" style="background-color: #95BDFF; border: none;"
                                onclick="editTreatment(${treatment.id})">Edit</button>
                        <button class="btn" style="background-color: #F7C8E0; border: none;"
                                onclick="deleteTreatment(${treatment.id})">Delete</button>
                    </td>
                `;
                treatmentList.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading treatments:', error));
}


function editTreatment(id) {
    localStorage.setItem('treatmentIdToEdit', id);
    window.location.href = 'http://localhost:8080/admin-panel/treatments/edit';
}

function addTreatment() {
    const name = document.getElementById('treatmentName').value;
    const price = document.getElementById('treatmentPrice').value;

    const treatment = {
        name: name,
        price: price
    };

    fetch('/rest/treatments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatment)
    })
    .then(response => {
        if (response.ok) {
            loadTreatments();
            document.getElementById('treatmentForm').reset();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'The treatment has been successfully added.',
                confirmButtonText: 'OK'
            });
        } else {
            return response.json().then(error => { throw error; });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an issue adding the treatment.',
        });
        console.error('Error adding treatment:', error);
    });
}

function deleteTreatment(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this treatment!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/rest/treatments/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    loadTreatments();
                    Swal.fire('Deleted!', 'The treatment has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting treatment.');
                }
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
}
