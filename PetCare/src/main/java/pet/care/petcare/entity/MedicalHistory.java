package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "medical_history")
public class MedicalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pet_id", nullable = false, unique = true)
    private Pet pet;

    @OneToMany(mappedBy = "medicalHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Diagnostic> diagnostics;
}
