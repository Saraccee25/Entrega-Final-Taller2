package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Medication;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.repository.IMedicationRepository;
import pet.care.petcare.service.IMedicationService;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationService implements IMedicationService {

    @Autowired
    private IMedicationRepository medicationRepository;
    @Override
    public Medication registerMedication(Medication medication) throws ValidationException {
        Optional<Medication> existingMedication = medicationRepository.findByName(medication.getName());
        if (existingMedication.isPresent()) {
            throw new ValidationException("The medication already exists in the inventory");
        }
        return medicationRepository.save(medication);
    }
    @Override
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    @Override
    public Optional<Medication> getMedicationById(Long id) {
        return medicationRepository.findById(id);
    }

    @Override
    public Medication updateMedication(Long id, Medication updatedMedication) throws ResourceNotFoundException {
        Optional<Medication> existingMedication = medicationRepository.findById(id);
        if (existingMedication.isPresent()) {
            Medication medication = existingMedication.get();
            medication.setName(updatedMedication.getName());
            medication.setUnitPrice(updatedMedication.getUnitPrice());
            medication.setStock(updatedMedication.getStock());
            return medicationRepository.save(medication);
        } else {
            throw new ResourceNotFoundException("Medication not found");
        }
    }

    @Override
    public void deleteMedication(Long id) throws ResourceNotFoundException {
        Optional<Medication> existingMedication = medicationRepository.findById(id);
        if (existingMedication.isPresent()) {
            medicationRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Medication not found");
        }
    }
}
