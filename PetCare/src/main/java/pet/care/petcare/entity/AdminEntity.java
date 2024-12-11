package pet.care.petcare.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class AdminEntity extends UserEntity{
}
