package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.ClinicStaff;

@Repository
public interface IClinicStaffRepository extends JpaRepository<ClinicStaff, Long> {
}
