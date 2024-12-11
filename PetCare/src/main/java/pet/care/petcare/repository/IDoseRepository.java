package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Dose;

@Repository
public interface IDoseRepository extends JpaRepository<Dose, Long> {
}
