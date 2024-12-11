document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('petIdToEdit', null);
    const userId = document.getElementById('userId');
    const clientId = userId ? userId.textContent.trim() : null;
    loadPets(clientId);
});

function loadPets(clientId) {
    fetch(`http://localhost:8080/rest/client/pets/${clientId}`)
        .then(response => response.json())
        .then(pets => {
            const petList = document.getElementById('myPetList');
            petList.innerHTML = '';

            if (pets.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="6" class="text-center">No pets registered</td>
                `;
                petList.appendChild(row);
            } else {
                pets.forEach(pet => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pet.id}</td>
                        <td>${pet.name} ${pet.lastname}</td>
                        <td>${calculateAge(pet.age)}</td>
                        <td>${weightUnit(pet.weight)}</td>
                        <td>${pet.race}</td>
                        <td>${pet.sex}</td>
                        <td>
                            <button class="btn btn-warning" style="background-color: #95BDFF; border: none;"
                            onclick="editPet(${pet.id})">Edit</button>
                            <button class="btn btn-warning" style="background-color: #95BDFF; border: none;"
                             onclick="viewMedicalHistory(${pet.id})">View medical history</button>
                        </td>
                    `;
                    petList.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error loading pets:', error);
            Swal.fire('Error', 'Could not load pets.', 'error');
        });
}

document.getElementById('petForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const userId = document.getElementById('userId').textContent.trim();

    const petData = {
        name: document.getElementById('petName').value,
        lastname: document.getElementById('petLastname').value,
        age: document.getElementById('petAge').value,
        race: document.getElementById('petRace').value,
        sex: document.getElementById('petSex').value,
        weight: standardizeWeight(),
        client: { userId: userId }
    };

    const formData = new FormData();
    formData.append('pet', new Blob([JSON.stringify(petData)], { type: 'application/json' }));
    formData.append('image', document.getElementById('petImage').files[0]);

    fetch('http://localhost:8080/rest/pets/', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        Swal.fire({
            title: 'Success',
            text: 'Pet added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'There was an error adding the pet.', 'error');
    });
});

function editPet(id) {
    localStorage.setItem('petIdToEdit', id);
    window.location.href = 'http://localhost:8080/client-panel/pets/edit';
}

function viewMedicalHistory(id) {
    localStorage.setItem('petIdMedicalHistory', id);
    window.location.href = 'http://localhost:8080/client-panel/pets/medical-history';
}


document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('petImage').click();
});

document.getElementById('petImage').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
    document.getElementById('fileNameDisplay').value = fileName;
});

function calculateAge(birthDate) {
    const currentDate = new Date();
    const birthDateObj = new Date(birthDate);

    let ageInYears = currentDate.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDateObj.getMonth();
    const dayDifference = currentDate.getDate() - birthDateObj.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        ageInYears--;
    }

    if (ageInYears === 0) {
        const ageInMonths = currentDate.getMonth() - birthDateObj.getMonth() + (ageInYears * 12);
        if (ageInMonths < 0) {
            ageInMonths += 12;
        }

        if (ageInMonths === 0) {
            const ageInDays = dayDifference;
            return `${ageInDays} days`;
        } else {
            return `${ageInMonths} months`;
        }
    } else {
        return `${ageInYears} years`;
    }
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');        
    return `${year}-${month}-${day}`;
}

    const currentDate = getCurrentDate();
    document.getElementById('petAge').setAttribute('max', currentDate);

document.getElementById('petWeight').addEventListener('input', standardizeWeight);
document.getElementById('weightUnit').addEventListener('change', standardizeWeight);

function standardizeWeight() {
    const weightInput = document.getElementById('petWeight');
    const weightUnit = document.getElementById('weightUnit').value;
    let weightInKg = parseFloat(weightInput.value);

    if (weightUnit === 'g') {
        weightInKg /= 1000;
    }
    return weightInKg; 
}

function weightUnit(weight){
    if(weight < 1){
        weight = weight * 1000
        return weight + " g"
    }else{
        return weight + " Kg"
    }
}