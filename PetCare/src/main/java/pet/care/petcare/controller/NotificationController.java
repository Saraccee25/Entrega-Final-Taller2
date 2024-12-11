package pet.care.petcare.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pet.care.petcare.entity.Notification;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.impl.NotificationClient;

@RestController
@RequestMapping("/rest/notifications")
public class NotificationController {

    @Autowired
    private NotificationClient notificationClient;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createNotifications(@PathVariable Long userId) {
        try {
            notificationClient.createNotifications(userId);
            return ResponseEntity.ok("Exit");
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }

    @PostMapping("/reprogrammed/{appointmentId}")
    public ResponseEntity<?> notifyReprogrammedAppointment(
            @PathVariable Long appointmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam(required = false) Long petId) {
        try {
            // Crear la notificación
            notificationClient.createNotificationForAppointment(petId, date, startTime, appointmentId);
            return ResponseEntity.ok("");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
        }
    }


    @PostMapping("/appointment-cancelled/{date}/{startTime}/{petId}")
    public ResponseEntity<String> createAppointmentCancellationNotification(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String startTime,
            @PathVariable Long petId) {

        notificationClient.createAppointmentCancellationNotification(date, startTime, petId);
        return ResponseEntity.ok("Notification created successfully.");
    }
    

    @PatchMapping("/{id}/mark-as-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Boolean readState = payload.get("readState");
        notificationClient.updateReadState(id, readState);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/update-reminder")
    public ResponseEntity<Notification> updateReminder(@PathVariable Long id) {
        Notification updatedNotification = notificationClient.updateReminder(id);
        return ResponseEntity.ok(updatedNotification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationClient.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
