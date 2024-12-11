package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IMedicalHistoryRepository;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.service.IMedicalHistoryService;

import java.util.List;

@Service
public class MedicalHistoryService implements IMedicalHistoryService {
    @Autowired
    private IMedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private IPetRepository petRepository;

    @Override
    public MedicalHistory create(Long petId, MedicalHistory medicalHistory) throws ResourceNotFoundException {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found."));

        if (medicalHistoryRepository.existsByPetId(petId)) {
            throw new ResourceNotFoundException("This pet already has a medical history.");
        }
        medicalHistory.setPet(pet);

        return medicalHistoryRepository.save(medicalHistory);
    }

    @Override
    public MedicalHistory findByPetId(Long petId) throws ResourceNotFoundException {
        return medicalHistoryRepository.findByPetId(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical history not found for pet with ID: " + petId));
    }

    @Override
    public List<MedicalHistory> findAll() {
        return medicalHistoryRepository.findAll();
    }
}
