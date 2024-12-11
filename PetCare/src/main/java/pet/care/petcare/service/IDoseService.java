package pet.care.petcare.service;

import pet.care.petcare.entity.Dose;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;

import java.util.List;
import java.util.Optional;

public interface IDoseService {
    public Dose registerDose(Dose dose) throws ValidationException;
    public List<Dose> getAllDose();
    public Optional<Dose> getDoseById(Long id);
    public Dose updateDose(Long id, Dose updatedDose) throws ResourceNotFoundException;
    public void deleteDose(Long id) throws ResourceNotFoundException;
}
