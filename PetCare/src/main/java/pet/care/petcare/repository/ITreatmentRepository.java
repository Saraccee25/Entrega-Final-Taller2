package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Treatment;

@Repository
public interface ITreatmentRepository extends JpaRepository<Treatment, Long> {
}
