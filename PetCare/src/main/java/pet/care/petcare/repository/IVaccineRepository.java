package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Vaccine;

import java.util.List;

@Repository
public interface IVaccineRepository extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByVaccinationCardId(Long vaccinationCardId);

}
