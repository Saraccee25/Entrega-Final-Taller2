package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.impl.ScheduleService;
import pet.care.petcare.service.impl.WeeklyScheduleService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest/weeklyschedule")
public class WeeklyScheduleController {

    @Autowired
    private WeeklyScheduleService weeklyScheduleService;

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/create")
    public ResponseEntity<?> createWeeklySchedule(@RequestBody WeeklySchedule weeklySchedule) {
        try {
            WeeklySchedule createdSchedule = weeklyScheduleService.create(weeklySchedule);
            return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(Map.of("error", "An error occurred while creating the weekly schedule."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<WeeklySchedule>> getAllWeeklySchedules() {
        List<WeeklySchedule> schedules = weeklyScheduleService.readAll();
        return new ResponseEntity<>(schedules, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWeeklyScheduleById(@PathVariable Long id) {
        try {
            WeeklySchedule weeklySchedule = weeklyScheduleService.readById(id);

            Map<String, Object> response = Map.of(
                    "id", weeklySchedule.getId(),
                    "startDate", weeklySchedule.getStartDate(),
                    "schedules", weeklySchedule.getSchedules().stream().map(schedule -> Map.of(
                            "id", schedule.getId(),
                            "date", schedule.getDate(),
                            "startTime", schedule.getStartTime(),
                            "endTime", schedule.getEndTime(),
                            "available", schedule.isAvailable(),
                            "clinicStaffId", schedule.getClinicStaffId(),
                            "clinicStaffName", schedule.getClinicStaffName(),
                            "clinicStaffLastName", schedule.getClinicStaffLastName()
                    )).toList()
            );

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWeeklySchedule(@PathVariable Long id) {
        try {
            WeeklySchedule weeklySchedule = weeklyScheduleService.readById(id);

            weeklySchedule.getSchedules().forEach(schedule -> {
                scheduleService.deleteSchedule(schedule.getId());
            });

            weeklyScheduleService.deleteWeeklySchedule(id);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(Map.of("error", "An error occurred while deleting the weekly schedule."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check-week")
    public ResponseEntity<?> checkWeekAvailability(@RequestParam("startDate") String startDateStr) {
        try {
            LocalDate startDate = LocalDate.parse(startDateStr);
            boolean weekOccupied = weeklyScheduleService.isWeekOccupied(startDate);
            return new ResponseEntity<>(Map.of("weekOccupied", weekOccupied), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(Map.of("error", "An error occurred while checking the week availability."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}