package pet.care.petcare.service;

import pet.care.petcare.entity.Vaccine;

import java.util.List;
import java.util.Optional;

public interface IVaccineService {
    public Vaccine insertVaccine(Vaccine vaccine) throws IllegalArgumentException;
    public List<Vaccine> getAllVaccines();
    public Optional<Vaccine> getVaccineById(Long id);
    public List<Vaccine> getVaccinesByVaccinationCard(Long vaccinationCardId);
}
