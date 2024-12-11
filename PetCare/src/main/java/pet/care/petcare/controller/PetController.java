package pet.care.petcare.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.entity.VaccinationCard;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.IMedicalHistoryService;
import pet.care.petcare.service.IPetService;
import pet.care.petcare.service.IVaccinationCardService;

@RestController
@RequestMapping("/rest/pets")
public class PetController {
    @Autowired
    private IPetService petService;

    @Autowired
    private IMedicalHistoryService medicalHistoryService;

    @Autowired
    private IVaccinationCardService vaccinationCardService;


    @PostMapping("/")
    public ResponseEntity<?> registerPet(@RequestPart("pet") Pet pet, @RequestPart("image") MultipartFile image) {
        try {
            Pet newPet = petService.insert(pet, image);
            MedicalHistory medicalHistory = medicalHistoryService.create(newPet.getId(), new MedicalHistory());
            VaccinationCard vaccinationCard = vaccinationCardService.insertVaccinationCard(new VaccinationCard(), newPet.getId());
            return ResponseEntity.ok(newPet);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }


    @GetMapping("/")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petService.findAll();
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/name/{petName}")
    public ResponseEntity<List<Pet>> getAllPetsByName(@PathVariable String petName) {
        List<Pet> pets = petService.findByName(petName);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable Long id) {
        Pet pet = petService.findById(id);
        if (pet != null) {
            return ResponseEntity.ok(pet);
        } else {
            return ResponseEntity.status(404).body("pet not found");
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updatePet(@RequestPart("pet") Pet pet, @RequestPart("image") MultipartFile image) {
        try {
            Pet updatePet = petService.update(pet, image);
            return ResponseEntity.ok(updatePet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deleteById(id);
            return ResponseEntity.ok("pet successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
