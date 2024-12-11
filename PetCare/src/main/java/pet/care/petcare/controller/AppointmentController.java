package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.service.impl.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/rest/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create/{clinicStaffId}/{date}")
    public ResponseEntity<List<Appointment>> createAppointmentsForClinicStaffAndDate(@PathVariable Long clinicStaffId, @PathVariable String date) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date);
            List<Appointment> appointments = appointmentService.createAppointmentsForClinicStaffAndDate(clinicStaffId, appointmentDate);
            return new ResponseEntity<>(appointments, HttpStatus.CREATED);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/appointments/available")
    @ResponseBody
    public List<Appointment> getAvailableAppointments(@RequestParam Long clinicStaffId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return appointmentService.getAppointmentsByClinicStaffAndDate(clinicStaffId, appointmentDate);
    }

    @GetMapping("/pets/available")
    @ResponseBody
    public List<Appointment> getPetsAvailableAppointments(@RequestParam Long clinicStaffId, @RequestParam Long petId) {
        return appointmentService.getAppointmentsByClinicStaffAndPetId(clinicStaffId, petId);
    }

    @DeleteMapping("/delete/clinicStaff/{clinicStaffId}")
    public ResponseEntity<Void> deleteAppointmentsByClinicStaff(@PathVariable Long clinicStaffId) {
        try {
            appointmentService.deleteAppointmentsByClinicStaff(clinicStaffId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{date}/{clinicStaffId}")
    public void deleteAppointmentByDateAndClinicStaffId(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable Long clinicStaffId) {

        appointmentService.deleteAppointmentByDateAndClinicStaffId(date, clinicStaffId);
    }

    @PostMapping("/book/{appointmentId}/{petId}")
    public ResponseEntity<?> bookAppointment(@PathVariable Long appointmentId, @PathVariable Long petId) {
        try {
            Appointment appointment = appointmentService.findAppointmentById(appointmentId);
            if (appointmentService.hasAppointmentOnDate(petId, appointment.getDate())) {
                return ResponseEntity.badRequest().body("The pet already has an appointment scheduled on this date.");
            }
            Appointment bookedAppointment = appointmentService.bookAppointment(appointmentId, petId);
            return ResponseEntity.ok(bookedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error assigning the appointment.");
        }
    }


    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPetId(@PathVariable Long petId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPetId(petId);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }


    @DeleteMapping("/delete/{date}/{startTime}/{petId}")
    public ResponseEntity<Void> deleteAppointmentByDateTimeAndPetId(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @PathVariable Long petId) {
        try {
            appointmentService.deleteAppointmentByDateTimeAndPetId(date, startTime, petId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{appointmentId}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam(required = false) Long petId) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(
                    appointmentId, date, startTime, petId
            );
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating the appointment.");
        }
    }



}