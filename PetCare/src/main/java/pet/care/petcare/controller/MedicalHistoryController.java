package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.impl.MedicalHistoryService;

import java.util.List;

@RestController
@RequestMapping("/rest/medical-histories")
public class MedicalHistoryController {
    @Autowired
    private MedicalHistoryService medicalHistoryService;

    @PostMapping("/{petId}")
    public ResponseEntity<?> createMedicalHistory(@PathVariable Long petId, @RequestBody MedicalHistory medicalHistory) {
        try {
            MedicalHistory savedHistory = medicalHistoryService.create(petId, medicalHistory);
            return new ResponseEntity<>(savedHistory, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the medical history.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<?> getMedicalHistoryByPetId(@PathVariable Long petId) {
        try {
            MedicalHistory medicalHistory = medicalHistoryService.findByPetId(petId);
            return new ResponseEntity<>(medicalHistory, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<MedicalHistory>> getAllMedicalHistories() {
        List<MedicalHistory> medicalHistories = medicalHistoryService.findAll();
        return new ResponseEntity<>(medicalHistories, HttpStatus.OK);
    }
}
