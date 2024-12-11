package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.UserEntity;

@Repository
public interface IUserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsername(String string);
}
