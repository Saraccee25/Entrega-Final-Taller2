package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Treatment;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.impl.TreatmentService;

import java.util.List;

@RestController
@RequestMapping("/rest/treatments")
public class TreatmentController {
    @Autowired
    private TreatmentService treatmentService;

    @GetMapping("/")
    public List<Treatment> readAll(){
        return treatmentService.readAll();
    }

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody @Valid Treatment treatment) {
        try {
            Treatment treatmentSave = treatmentService.create(treatment);
            return new ResponseEntity<>(treatmentSave, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (ValidationException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the treatment.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Treatment treatment) {
        try {
            Treatment updatedTreatment = treatmentService.update(id, treatment);
            return new ResponseEntity<>(updatedTreatment, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while updating the treatment.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            treatmentService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while deleting the treatment.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> readById(@PathVariable Long id) {
        try {
            Treatment treatment = treatmentService.readById(id);
            return new ResponseEntity<>(treatment, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while fetching the treatment.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
