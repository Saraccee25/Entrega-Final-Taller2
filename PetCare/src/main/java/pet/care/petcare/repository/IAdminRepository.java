package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.AdminEntity;

@Repository
public interface IAdminRepository extends JpaRepository<AdminEntity, Long> {
}
