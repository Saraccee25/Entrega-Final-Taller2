package pet.care.petcare.service;

import pet.care.petcare.entity.Medication;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;

import java.util.List;
import java.util.Optional;

public interface IMedicationService {
    public Medication registerMedication(Medication medication) throws ValidationException;
    List<Medication> getAllMedications();

    Optional<Medication> getMedicationById(Long id);

    Medication updateMedication(Long id, Medication updatedMedication) throws ResourceNotFoundException;

    void deleteMedication(Long id) throws ResourceNotFoundException;
}
