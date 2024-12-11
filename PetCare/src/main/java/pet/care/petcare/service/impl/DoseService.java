package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Dose;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.repository.IDoseRepository;
import pet.care.petcare.service.IDoseService;

import java.util.List;
import java.util.Optional;

@Service
public class DoseService implements IDoseService {

    @Autowired
    private IDoseRepository doseRepository;

    @Override
    public Dose registerDose(Dose dose) throws ValidationException {
        if (dose == null) {
            throw new ResourceNotFoundException("Dose information is missing");
        }
        return doseRepository.save(dose);
    }

    @Override
    public List<Dose> getAllDose() {
        return doseRepository.findAll();
    }

    @Override
    public Optional<Dose> getDoseById(Long id) {
        return doseRepository.findById(id);
    }

    @Override
    public Dose updateDose(Long id, Dose updatedDose) throws ResourceNotFoundException {
        Optional<Dose> existingDose = doseRepository.findById(id);
        if (existingDose.isPresent()) {
            Dose dose = existingDose.get();
            dose.setDescription(updatedDose.getDescription());
            dose.setAmount(updatedDose.getAmount());
            return doseRepository.save(dose);
        } else {
            throw new ResourceNotFoundException("Dose not found");
        }
    }

    @Override
    public void deleteDose(Long id) throws ResourceNotFoundException {
        if (!doseRepository.existsById(id)){
            throw new ResourceNotFoundException("Dose not found");
        }
        doseRepository.deleteById(id);
    }
}
