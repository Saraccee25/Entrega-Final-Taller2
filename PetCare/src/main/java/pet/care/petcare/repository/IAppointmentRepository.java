package pet.care.petcare.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByClinicStaff_UserIdAndDate(Long userId, LocalDate date);
    List<Appointment> findByClinicStaff_UserId(Long clinicStaffId);
    List<Appointment> findByClinicStaff_UserIdAndPetId(Long userId, Long petId);
    Optional<Appointment> findByDateAndStartTime(LocalDate date, LocalTime startTime);


    @Transactional
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.clinicStaff.id = :clinicStaffId AND a.date = :date")
    void deleteByClinicStaffIdAndDate(Long clinicStaffId, LocalDate date);

    @Transactional
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.date = :date")
    void deleteByDate(LocalDate date);


    List<Appointment> findByDate(LocalDate date);

    void deleteByDateAndClinicStaff_UserId(LocalDate date, Long clinicStaffId);

    List<Appointment> findByPet_Id(Long petId);

    @Modifying
    @Transactional
    @Query("UPDATE Appointment a SET a.pet = null, a.available = true WHERE a.date = :date AND a.startTime = :startTime AND a.pet.id = :petId")
    void updateAppointmentAvailability(LocalDate date, LocalTime startTime, Long petId);

    boolean existsByPet_IdAndDate(Long petId, LocalDate date);



}
