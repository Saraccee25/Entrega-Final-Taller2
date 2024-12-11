package pet.care.petcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "appointment")
public class Appointment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "start time cannot be null")
    private LocalTime startTime;

    @NotNull(message = "end time cannot be null")
    private LocalTime endTime;

    @NotNull(message = "date cannot be null")
    private LocalDate date;

    @NotNull(message = "available cannot be null")
    private boolean available;

    @ManyToOne
    @JoinColumn(name = "clinicStaff_id", nullable = false)
    private ClinicStaff clinicStaff;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}