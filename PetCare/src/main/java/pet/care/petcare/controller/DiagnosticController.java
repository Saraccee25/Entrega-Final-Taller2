package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IDiagnosticRepository;
import pet.care.petcare.service.impl.DiagnosticService;

import java.util.List;

@RestController
@RequestMapping("/rest/diagnostics")
public class DiagnosticController {
    @Autowired
    private DiagnosticService diagnosticService;

    @Autowired
    private IDiagnosticRepository diagnosticRepository;

    @PostMapping("/{medicalHistoryId}")
    public ResponseEntity<?> insert(@PathVariable Long medicalHistoryId, @RequestBody Diagnostic diagnostic) {
        try {
            Diagnostic diagnosticSave = diagnosticService.create(medicalHistoryId, diagnostic);
            return new ResponseEntity<>(diagnosticSave, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("An error occurred while creating the diagnostic: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/")
    public ResponseEntity<List<Diagnostic>> getAllDiagnostics() {
        List<Diagnostic> diagnostics = diagnosticService.readAll();
        return new ResponseEntity<>(diagnostics, HttpStatus.OK);
    }

    @GetMapping("/history/{medicalHistoryId}")
    public ResponseEntity<List<Diagnostic>> getDiagnosticsByMedicalHistoryId(@PathVariable Long medicalHistoryId) {
        List<Diagnostic> diagnostics = diagnosticRepository.findByMedicalHistoryId(medicalHistoryId);
        return new ResponseEntity<>(diagnostics, HttpStatus.OK);
    }


}
