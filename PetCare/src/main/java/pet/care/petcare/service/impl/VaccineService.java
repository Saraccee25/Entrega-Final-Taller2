package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Medication;
import pet.care.petcare.entity.VaccinationCard;
import pet.care.petcare.entity.Vaccine;
import pet.care.petcare.repository.IMedicationRepository;
import pet.care.petcare.repository.IVaccinationCardRepository;
import pet.care.petcare.repository.IVaccineRepository;
import pet.care.petcare.service.IVaccineService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VaccineService implements IVaccineService {

    @Autowired
    private IVaccineRepository vaccineRepository;

    @Autowired
    private IMedicationRepository medicationRepository;

    @Autowired
    private IVaccinationCardRepository vaccinationCardRepository;

    @Transactional
    @Override
    public Vaccine insertVaccine(Vaccine vaccine) throws IllegalArgumentException {

        Optional<Medication> medicationOpt = medicationRepository.findById(vaccine.getMedication().getId());
        if (!medicationOpt.isPresent()) {
            throw new IllegalArgumentException("Medication not found");
        }
        Medication medication = medicationOpt.get();

        if (!medication.isVaccine()) {
            throw new IllegalArgumentException("The medication must be a vaccine");
        }
        Long vaccinationCardId = vaccine.getVaccinationCard().getId();
        Optional<VaccinationCard> vaccinationCardOpt = vaccinationCardRepository.findById(vaccinationCardId);
        if (!vaccinationCardOpt.isPresent()) {
            throw new IllegalArgumentException("Vaccination Card not found");
        }

        vaccine.setVaccinationCard(vaccinationCardOpt.get());
        vaccine.setMedication(medication);

        Vaccine savedVaccine = vaccineRepository.save(vaccine);

        return savedVaccine;
    }

    @Override
    public List<Vaccine> getAllVaccines() {
        return vaccineRepository.findAll();
    }

    @Override
    public Optional<Vaccine> getVaccineById(Long id) {
        return vaccineRepository.findById(id);
    }

    @Override
    public List<Vaccine> getVaccinesByVaccinationCard(Long vaccinationCardId) {
        return vaccineRepository.findByVaccinationCardId(vaccinationCardId);
    }

}



