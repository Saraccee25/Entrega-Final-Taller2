package pet.care.petcare.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.repository.IAppointmentRepository;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.repository.IScheduleRepository;
import pet.care.petcare.service.IAppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService implements IAppointmentService {


    @Autowired
    private IScheduleRepository scheduleRepository;

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPetRepository petRepository;

    @Transactional
    public List<Appointment> createAppointmentsForClinicStaffAndDate(Long clinicStaffId, LocalDate date) {
        List<Schedule> schedules = scheduleRepository.findByClinicStaffUserIdAndDate(clinicStaffId, date);

        List<Appointment> appointments = new ArrayList<>();

        for (Schedule schedule : schedules) {
            LocalTime currentStartTime = schedule.getStartTime();

            while (currentStartTime.isBefore(schedule.getEndTime())) {
                Appointment appointment = new Appointment();
                appointment.setStartTime(currentStartTime);
                appointment.setEndTime(currentStartTime.plusMinutes(30));
                appointment.setDate(schedule.getDate());
                appointment.setAvailable(true);
                appointment.setClinicStaff(schedule.getClinicStaff());

                appointments.add(appointment);
                currentStartTime = currentStartTime.plusMinutes(30);
            }
        }

        appointmentRepository.saveAll(appointments);

        return appointments;
    }

    public List<Appointment> getAppointmentsByClinicStaffAndDate(Long clinicStaffId, LocalDate date) {
        return appointmentRepository.findByClinicStaff_UserIdAndDate(clinicStaffId, date);
    }

    public List<Appointment> getAppointmentsByClinicStaffAndPetId(Long clinicStaffId, Long petId) {
        return appointmentRepository.findByClinicStaff_UserIdAndPetId(clinicStaffId, petId);
    }

    public void deleteAppointmentsByClinicStaff(Long clinicStaffId) {
        List<Appointment> appointments = appointmentRepository.findByClinicStaff_UserId(clinicStaffId);
        appointmentRepository.deleteAll(appointments);
    }

    public void deleteAppointmentsByClinicStaffAndDate(Long clinicStaffId, LocalDate date) {
        appointmentRepository.deleteByClinicStaffIdAndDate(clinicStaffId, date);
    }

    public void deleteAppointmentsByDate(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDate(date);
        if (!appointments.isEmpty()) {
            appointmentRepository.deleteByDate(date);
        } else {
            System.out.println("No appointments found for the date: " + date);
        }
    }

    @Transactional
    public void deleteAppointmentByDateAndClinicStaffId(LocalDate date, Long clinicStaffId) {
        appointmentRepository.deleteByDateAndClinicStaff_UserId(date, clinicStaffId);
    }

    @Transactional
    @Override
    public Appointment bookAppointment(Long appointmentId, Long petId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.isAvailable()) {
            throw new RuntimeException("Appointment is already booked");
        }

        Pet pet = new Pet();
        pet.setId(petId);
        appointment.setPet(pet);
        appointment.setAvailable(false);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPetId(Long petId) {
        return appointmentRepository.findByPet_Id(petId);
    }

    @Override
    @Transactional
    public void deleteAppointmentByDateTimeAndPetId(LocalDate date, LocalTime startTime, Long petId) {
        appointmentRepository.updateAppointmentAvailability(date, startTime, petId);
    }

    public boolean hasAppointmentOnDate(Long petId, LocalDate date) {
        return appointmentRepository.existsByPet_IdAndDate(petId, date);
    }

    public Appointment findAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
    }

    @Transactional
    @Override
    public Appointment updateAppointment(Long appointmentId, LocalDate date, LocalTime startTime, Long petId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        appointment.setPet(null);
        appointment.setAvailable(true);

        Optional<Appointment> updateAppointment = appointmentRepository.findByDateAndStartTime(date, startTime);
        Optional<Pet> pet = petRepository.findById(petId);
        Appointment appointment1 = updateAppointment.get();
        if(updateAppointment.isPresent()){
            appointment1.setPet(pet.get());
            appointment1.setAvailable(false);
        }

        appointmentRepository.save(appointment);

        return appointmentRepository.save(appointment1);
    }

}
