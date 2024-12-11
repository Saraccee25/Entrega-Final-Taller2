package pet.care.petcare.service;

import pet.care.petcare.entity.Treatment;
import pet.care.petcare.exception.ResourceNotFoundException;

import java.util.List;

public interface ITreatmentService {
    public Treatment create(Treatment treatment) throws ResourceNotFoundException;
    public List<Treatment> readAll();
    public Treatment update(Long id, Treatment treatment) throws ResourceNotFoundException;
    public void deleteById(Long id) throws ResourceNotFoundException;
}
