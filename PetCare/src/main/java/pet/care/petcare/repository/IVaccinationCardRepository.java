package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.VaccinationCard;

import java.util.Optional;

@Repository
public interface IVaccinationCardRepository extends JpaRepository<VaccinationCard, Long> {
    Optional<VaccinationCard> findByPetId(Long petId);
}
