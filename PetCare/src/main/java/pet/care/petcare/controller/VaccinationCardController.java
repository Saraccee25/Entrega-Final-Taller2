package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.VaccinationCard;
import pet.care.petcare.service.IVaccinationCardService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/vaccination-cards")
public class VaccinationCardController {
    @Autowired
    private IVaccinationCardService vaccinationCardService;

    @PostMapping("/")
    public ResponseEntity<?> insertVaccinationCard(@RequestBody VaccinationCard vaccinationCard, Long petId) {
        try {
            VaccinationCard savedVaccinationCard = vaccinationCardService.insertVaccinationCard(vaccinationCard, petId);
            return ResponseEntity.ok(savedVaccinationCard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<VaccinationCard>> getAllVaccinationCards() {
        try {
            List<VaccinationCard> vaccinationCards = vaccinationCardService.getAllVaccinationCards();
            return ResponseEntity.ok(vaccinationCards);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVaccinationCardById(@PathVariable Long id) {
        try {
            VaccinationCard vaccinationCard = vaccinationCardService.getVaccinationCardById(id).orElse(null);

            if (vaccinationCard != null) {
                return ResponseEntity.ok(vaccinationCard);
            } else {
                return ResponseEntity.status(404).body("Vaccination card not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/pets/{petId}")
    public ResponseEntity<?> getVaccinationCardByPetId(@PathVariable Long petId) {
        try {
            Optional<VaccinationCard> vaccinationCard = vaccinationCardService.getVaccinationCardByPetId(petId);
            if (vaccinationCard.isPresent()) {
                return ResponseEntity.ok(vaccinationCard.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No vaccination card found for petId: " + petId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving data.");
        }
    }


}
