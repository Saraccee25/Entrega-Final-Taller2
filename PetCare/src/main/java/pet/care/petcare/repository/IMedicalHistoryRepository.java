package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.entity.Medication;

import java.util.Optional;

public interface IMedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    Optional<MedicalHistory> findByPetId(Long petId);
    boolean existsByPetId(Long petId);
}
