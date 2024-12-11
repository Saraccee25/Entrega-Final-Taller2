package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Dose;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.IDoseService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/dose")
public class DoseController {

    @Autowired
    private IDoseService doseService;

    @PostMapping("/")
    public ResponseEntity<?> registerDose(@Valid @RequestBody List<Dose> doses) {
        try {
            for (Dose dose : doses) {
                Dose newDose = doseService.registerDose(dose);
            }
            return ResponseEntity.ok(Collections.singletonMap("message", "Successfully registered doses."));
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Dose>> getAllDose() {
        List<Dose> doses = doseService.getAllDose();
        return ResponseEntity.ok(doses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoseById(@PathVariable Long id) {
        Optional<Dose> dose = doseService.getDoseById(id);
        if (dose.isPresent()) {
            return ResponseEntity.ok(dose.get());
        } else {
            return ResponseEntity.status(404).body("Dose not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDose(@PathVariable Long id, @Valid @RequestBody Dose updatedDose) {
        try {
            Dose dose = doseService.updateDose(id, updatedDose);
            return ResponseEntity.ok("Dose successfully updated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDose(@PathVariable Long id) {
        try {
            doseService.deleteDose(id);
            return ResponseEntity.ok("Dose successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
