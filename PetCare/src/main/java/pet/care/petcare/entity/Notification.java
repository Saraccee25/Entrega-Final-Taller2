package pet.care.petcare.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnore
    private UserEntity user;

    private String message;
    private LocalDate date;
    private LocalTime time;
    private Boolean readState;
    private LocalDate reminder;

    public Notification() {
        this.date = LocalDate.now();
        this.time = LocalTime.now();
        this.readState = true;
    }

    

}
