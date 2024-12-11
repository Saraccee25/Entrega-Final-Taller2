package pet.care.petcare.service;

import pet.care.petcare.entity.Schedule;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;

import java.util.List;

public interface IWeeklyScheduleService {
    WeeklySchedule create(WeeklySchedule weeklySchedule) throws ResourceNotFoundException;
    List<WeeklySchedule> readAll();
}
