package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Entity
@Data
@Table(name = "medications")
public class Medication implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "The name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "The unit price is required")
    @Column(nullable = false)
    private Long unitPrice;

    @NotNull(message = "The stock is required")
    @Column(nullable = false)
    private Long stock;

    @OneToMany(mappedBy = "medication", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Dose> doses;

    @Column(nullable = false)
    private boolean isVaccine;

    @OneToMany(mappedBy = "medication", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Vaccine> vaccines;

    @Override
    public String toString() {
        return "Medication{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", unitPrice=" + unitPrice +
                ", stock=" + stock +
                ", isVaccine=" + isVaccine +
                '}';
    }


}
