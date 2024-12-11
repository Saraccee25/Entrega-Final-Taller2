package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "vaccination_card")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "vaccinationCard", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vaccine> vaccines;

    @OneToOne
    @JoinColumn(name = "pet_id", nullable = false, unique = true)
    private Pet pet;

}
