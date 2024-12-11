package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.impl.ScheduleService;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/rest/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/assign")
    public ResponseEntity<?> assignSchedule(@RequestParam Long clinicStaffId, @RequestParam @Valid LocalDate date) {
        try {
            Schedule assignedSchedule = scheduleService.assignSchedule(clinicStaffId, date);
            return new ResponseEntity<>(assignedSchedule, HttpStatus.CREATED);
        } catch (ValidationException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while assigning the schedule.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            scheduleService.deleteSchedule(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while deleting the schedule.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> readById(@PathVariable Long id) {
        try {
            Schedule schedule = scheduleService.readById(id);
            return new ResponseEntity<>(schedule, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while fetching the schedule.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Schedule updatedSchedule = scheduleService.updateSchedule(id, updates);
            return new ResponseEntity<>(updatedSchedule, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while updating the schedule.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkExistingSchedule(@RequestParam @Valid LocalDate startDate) {
        try {
            boolean exists = scheduleService.checkIfScheduleExists(startDate);
            return new ResponseEntity<>(Map.of("exists", exists), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while checking the schedule.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/find/{date}/{clinicStaffId}")
    public Optional<Schedule> getScheduleByDateAndClinicStaffId(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable Long clinicStaffId) {

        return scheduleService.findScheduleByDateAndClinicStaffId(date, clinicStaffId);
    }

    @DeleteMapping("/delete/{date}/{clinicStaffId}")
    public void deleteScheduleByDateAndClinicStaffId(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable Long clinicStaffId) {

        scheduleService.deleteScheduleByDateAndClinicStaffId(date, clinicStaffId);
    }


}