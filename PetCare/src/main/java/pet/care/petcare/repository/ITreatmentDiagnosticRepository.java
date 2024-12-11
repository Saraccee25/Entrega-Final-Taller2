package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pet.care.petcare.entity.TreatmentsDiagnostics;

@Repository
public interface ITreatmentDiagnosticRepository extends JpaRepository<TreatmentsDiagnostics, Long> {
}
