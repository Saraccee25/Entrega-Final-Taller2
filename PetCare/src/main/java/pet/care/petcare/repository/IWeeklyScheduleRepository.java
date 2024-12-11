package pet.care.petcare.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pet.care.petcare.entity.WeeklySchedule;

import java.time.LocalDate;
import java.util.Optional;

public interface IWeeklyScheduleRepository extends JpaRepository<WeeklySchedule, Long> {
    @EntityGraph(attributePaths = "schedules")
    Optional<WeeklySchedule> findById(Long id);

    @Query("SELECT ws FROM WeeklySchedule ws WHERE ws.startDate = :startDate")
    Optional<WeeklySchedule> findByStartDate(@Param("startDate") LocalDate startDate);

    @Query("SELECT COUNT(ws) > 0 FROM WeeklySchedule ws WHERE ws.startDate BETWEEN :startDate AND :endDate")
    boolean existsByStartDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Modifying
    @Transactional
    @Query("UPDATE WeeklySchedule ws SET ws.startDate = :startDate WHERE ws.id = :id")
    int updateStartDateById(@Param("id") Long id, @Param("startDate") LocalDate startDate);
}
