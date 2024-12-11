document.addEventListener('DOMContentLoaded', () => {
    const petId = localStorage.getItem('petIdToEdit');
    const userId = document.getElementById('userId').textContent.trim();

    if (!petId || petId === 'null') {
        window.location.href = 'http://localhost:8080/client-panel/pets';
        return;
    }

    loadPetData(petId);

    document.getElementById('petForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            updatePet(petId);
        }
    });
});

function validateForm() {
    const petName = document.getElementById('petName').value.trim();
    const petLastname = document.getElementById('petLastname').value.trim();
    const petAge = document.getElementById('petAge').value.trim();
    const petRace = document.getElementById('petRace').value.trim();
    const petWeight = document.getElementById('petWeight').value.trim();
    const petSex = document.getElementById('petSex').value;

    if (!petName || !petLastname || !petAge || !petRace || !petWeight || !petSex) {
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

function loadPetData(id) {
    fetch(`http://localhost:8080/rest/pets/${id}`)
        .then(response => response.json())
        .then(pet => {
            document.getElementById('petName').value = pet.name;
            document.getElementById('petLastname').value = pet.lastname;
            document.getElementById('petAge').value = pet.age;
            document.getElementById('petRace').value = pet.race;
            document.getElementById('petSex').value = pet.sex;
            document.getElementById('petImageDisplay').src = pet.image;
            weightAndUnit(pet.weight)

        })
        .catch(error => console.error('Error loading pet data:', error));
}

async function updatePet(petId) {
    const userId = document.getElementById('userId').textContent.trim();

    const petData = {
        id: petId,
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

    const imageFile = document.getElementById('petImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    } else {
        const existingImageSrc = document.getElementById('petImageDisplay').src;
        const filename = existingImageSrc.split('/').pop();

        try {
            const response = await fetch(`http://localhost:8080/uploads/${filename}`);
            const blob = await response.blob();
            formData.append('image', blob, filename);
        } catch (error) {
            console.error('Error fetching existing image:', error);
            Swal.fire('Error', 'Could not fetch the existing image.', 'error');
            return;
        }
    }

    fetch('http://localhost:8080/rest/pets/', {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: 'Success!',
            text: 'Pet updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'There was an error updating the pet.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('petImage').click();
});

document.getElementById('petImage').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
    document.getElementById('fileNameDisplay').value = fileName;
});


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
    
    function weightAndUnit(weight){
        if(weight < 1){
            document.getElementById('petWeight').value = weight * 1000;
            document.getElementById('weightUnit').value = "g";
        }else{
            document.getElementById('petWeight').value = weight;
            document.getElementById('weightUnit').value = "kg";
        }
    
    }


