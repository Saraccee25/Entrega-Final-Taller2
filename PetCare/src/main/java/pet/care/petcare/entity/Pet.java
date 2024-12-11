package pet.care.petcare.entity;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "The name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "The lastname is required")
    @Column(nullable = false)
    private String lastname;

    @NotNull(message = "The age is required")
    @Column(nullable = false)
    private LocalDate age;

    @NotNull(message = "The race is required")
    @Column(nullable = false)
    private String race;

    @NotNull(message = "The sex is required")
    @Column(nullable = false)
    private String sex;

    @NotNull(message = "The weight is required")
    @Column(nullable = false)
    private Float weight;

    @Column(nullable = false)
    private String image;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Appointment> appointmentSet;


}