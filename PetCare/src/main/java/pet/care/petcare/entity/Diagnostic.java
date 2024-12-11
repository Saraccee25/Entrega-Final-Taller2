package pet.care.petcare.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "diagnostic")
public class Diagnostic implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Description is required")
    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "medical_history_id", nullable = false)
    @JsonIgnore
    private MedicalHistory medicalHistory;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    @OneToMany(mappedBy = "diagnostic", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TreatmentsDiagnostics> treatmentsDiagnosticses;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

}
