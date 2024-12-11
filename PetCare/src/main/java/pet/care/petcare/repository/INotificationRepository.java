package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pet.care.petcare.entity.Notification;

@Repository 
public interface INotificationRepository extends JpaRepository<Notification, Long> {}