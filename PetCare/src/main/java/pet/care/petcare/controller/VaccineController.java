package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.VaccinationCard;
import pet.care.petcare.entity.Vaccine;
import pet.care.petcare.service.IVaccineService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/vaccines")
public class VaccineController {
    @Autowired
    private IVaccineService vaccineService;

    @PostMapping("/{vaccinationCardId}")
    public ResponseEntity<?> insertVaccine(@PathVariable Long vaccinationCardId, @RequestBody Vaccine vaccine) {
        try {
            VaccinationCard vaccinationCard = new VaccinationCard();
            vaccinationCard.setId(vaccinationCardId);
            vaccine.setVaccinationCard(vaccinationCard);
            Vaccine savedVaccine = vaccineService.insertVaccine(vaccine);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVaccine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Vaccine>> getAllVaccines() {
        return ResponseEntity.ok(vaccineService.getAllVaccines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVaccineById(@PathVariable Long id) {
        Optional<Vaccine> vaccine = vaccineService.getVaccineById(id);
        if (vaccine.isPresent()) {
            return ResponseEntity.ok(vaccine.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/byVaccinationCard/{vaccinationCardId}")
    public ResponseEntity<List<Vaccine>> getVaccinesByVaccinationCard(@PathVariable Long vaccinationCardId) {
        try {
            List<Vaccine> vaccines = vaccineService.getVaccinesByVaccinationCard(vaccinationCardId);
            if (vaccines.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(vaccines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}
