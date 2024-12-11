package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Client;

@Repository
public interface IClientRepository extends JpaRepository<Client, Long> {
}
