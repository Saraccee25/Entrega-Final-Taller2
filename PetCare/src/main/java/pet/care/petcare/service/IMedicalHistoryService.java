package pet.care.petcare.service;

import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.exception.ResourceNotFoundException;

import java.util.List;

public interface IMedicalHistoryService {
    MedicalHistory create(Long petId, MedicalHistory medicalHistory) throws ResourceNotFoundException;
    MedicalHistory findByPetId(Long petId) throws ResourceNotFoundException;
    List<MedicalHistory> findAll();
}
