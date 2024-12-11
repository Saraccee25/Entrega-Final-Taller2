package pet.care.petcare.service;

import pet.care.petcare.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IAppointmentService {

    List<Appointment> createAppointmentsForClinicStaffAndDate(Long clinicStaffId, LocalDate date);

    Appointment bookAppointment(Long appointmentId, Long petId);

    void deleteAppointmentByDateTimeAndPetId(LocalDate date, LocalTime startTime, Long petId);

    public Appointment updateAppointment(Long appointmentId, LocalDate date, LocalTime startTime, Long petId);

}
