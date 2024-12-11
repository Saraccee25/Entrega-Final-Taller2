package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Medication;

import java.util.Optional;

@Repository
public interface IMedicationRepository extends JpaRepository<Medication, Long> {
    Optional<Medication> findByName(String name);
}
