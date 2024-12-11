package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Treatment;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.repository.ITreatmentRepository;
import pet.care.petcare.service.ITreatmentService;

import java.util.List;

@Service
public class TreatmentService implements ITreatmentService {

    @Autowired
    private ITreatmentRepository treatmentRepository;

    @Override
    public Treatment create(Treatment treatment) throws ResourceNotFoundException, ValidationException {
        validateTreatment(treatment);
        return treatmentRepository.save(treatment);
    }

    @Override
    public List<Treatment> readAll() {
        return treatmentRepository.findAll();
    }

    @Override
    public Treatment update(Long id, Treatment treatment) throws ResourceNotFoundException, ValidationException {
        Treatment existingTreatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment with ID " + id + " not found"));

        validateTreatment(treatment);

        existingTreatment.setName(treatment.getName());
        existingTreatment.setPrice(treatment.getPrice());

        return treatmentRepository.save(existingTreatment);
    }

    @Override
    public void deleteById(Long id) throws ResourceNotFoundException {
        if (!treatmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Treatment with ID " + id + " not found");
        }

        treatmentRepository.deleteById(id);
    }

    private void validateTreatment(Treatment treatment) throws ValidationException {
        if (treatment.getName() == null || treatment.getName().trim().isEmpty()) {
            throw new ValidationException("Treatment name cannot be null or empty");
        }

        if (treatment.getPrice() == null) {
            throw new ValidationException("Treatment price cannot be null");
        }

        if (treatment.getPrice() <= 0) {
            throw new ValidationException("Treatment price must be a positive value");
        }

    }

    public Treatment readById(Long id) {
        return treatmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treatment not found with id " + id));
    }

}
