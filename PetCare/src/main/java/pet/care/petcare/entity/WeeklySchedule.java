package pet.care.petcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weekly_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklySchedule implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "weeklySchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> schedules = new ArrayList<>();

    private LocalDate startDate;

    public void addSchedule(Schedule schedule) {
        schedule.setWeeklySchedule(this);
        this.schedules.add(schedule);
    }

    public void removeSchedule(Schedule schedule) {
        schedule.setWeeklySchedule(null);
        this.schedules.remove(schedule);
    }
}