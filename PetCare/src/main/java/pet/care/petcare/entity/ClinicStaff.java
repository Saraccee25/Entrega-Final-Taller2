package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "clinic_staff")
public class ClinicStaff extends UserEntity implements Serializable{

    @OneToMany(mappedBy = "clinicStaff", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Schedule> scheduleSet;

    @OneToMany(mappedBy = "clinicStaff", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Appointment> appointmentSet;
}
