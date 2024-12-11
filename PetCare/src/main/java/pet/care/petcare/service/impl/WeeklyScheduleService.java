package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IScheduleRepository;
import pet.care.petcare.repository.IWeeklyScheduleRepository;
import pet.care.petcare.service.IWeeklyScheduleService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WeeklyScheduleService implements IWeeklyScheduleService {

    @Autowired
    private IWeeklyScheduleRepository weeklyScheduleRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private IScheduleRepository scheduleRepository;

    @Transactional
    public WeeklySchedule create(WeeklySchedule weeklySchedule) throws ResourceNotFoundException {
        if (weeklySchedule == null || weeklySchedule.getSchedules() == null || weeklySchedule.getSchedules().isEmpty()) {
            throw new IllegalArgumentException("WeeklySchedule and its schedules cannot be null or empty.");
        }

        Schedule firstSchedule = weeklySchedule.getSchedules().get(0);
        LocalDate startDate = firstSchedule.getDate();

        weeklySchedule.setStartDate(startDate);

        List<Schedule> schedules = new ArrayList<>(weeklySchedule.getSchedules());
        weeklySchedule.setSchedules(new ArrayList<>());

        WeeklySchedule savedWeeklySchedule = weeklyScheduleRepository.saveAndFlush(weeklySchedule);

        for (Schedule schedule : schedules) {
            if (schedule.getClinicStaff() == null) {
                throw new ResourceNotFoundException("Schedule with null clinicStaff is not allowed.");
            }
            schedule.setWeeklySchedule(savedWeeklySchedule);
            savedWeeklySchedule.getSchedules().add(schedule);
        }

        weeklyScheduleRepository.save(savedWeeklySchedule);

        for (Schedule schedule : savedWeeklySchedule.getSchedules()) {
            appointmentService.createAppointmentsForClinicStaffAndDate(schedule.getClinicStaff().getUserId(), schedule.getDate());
        }

        return savedWeeklySchedule;
    }


    public WeeklySchedule readById(Long id) throws ResourceNotFoundException {
        return weeklyScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WeeklySchedule not found with id: " + id));
    }

    public void deleteWeeklySchedule(Long id) {
        WeeklySchedule weeklySchedule = readById(id);
        weeklyScheduleRepository.delete(weeklySchedule);
    }

    @Override
    public List<WeeklySchedule> readAll() {
        return weeklyScheduleRepository.findAll();
    }

    public boolean isWeekOccupied(LocalDate startDate) {
        LocalDate endDate = startDate.plusDays(5);
        return weeklyScheduleRepository.existsByStartDateBetween(startDate, endDate);
    }

    public void updateStartDate(Long id, LocalDate newStartDate) {
        int updatedRows = weeklyScheduleRepository.updateStartDateById(id, newStartDate);
        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Weekly schedule not found with id " + id);
        }
    }
}
