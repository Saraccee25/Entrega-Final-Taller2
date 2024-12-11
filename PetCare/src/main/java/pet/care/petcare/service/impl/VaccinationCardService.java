package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.entity.VaccinationCard;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.repository.IVaccinationCardRepository;
import pet.care.petcare.service.IVaccinationCardService;

import java.util.List;
import java.util.Optional;

@Service
public class VaccinationCardService implements IVaccinationCardService {

    @Autowired
    private IVaccinationCardRepository vaccinationCardRepository;

    @Autowired
    private IPetRepository petRepository;
    @Transactional
    @Override
    public VaccinationCard insertVaccinationCard(VaccinationCard vaccinationCard, Long petId) throws IllegalArgumentException {
        Optional<Pet> petOpt = petRepository.findById(petId);
        if (!petOpt.isPresent()) {
            throw new IllegalArgumentException("Pet not found");
        }
        Pet pet = petOpt.get();
        Optional<VaccinationCard> existingVaccinationCard = vaccinationCardRepository.findByPetId(pet.getId());
        if (existingVaccinationCard.isPresent()) {
            throw new IllegalArgumentException("Pet already has a vaccination card");
        }
        vaccinationCard.setPet(pet);
        return vaccinationCardRepository.save(vaccinationCard);
    }

    @Override
    public List<VaccinationCard> getAllVaccinationCards() {
        return vaccinationCardRepository.findAll();
    }

    @Override
    public Optional<VaccinationCard> getVaccinationCardById(Long id) {
        return vaccinationCardRepository.findById(id);
    }

    @Override
    public Optional<VaccinationCard> getVaccinationCardByPetId(Long petId) {
        return vaccinationCardRepository.findByPetId(petId);
    }

}
