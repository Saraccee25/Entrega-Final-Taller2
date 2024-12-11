package pet.care.petcare.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pet.care.petcare.entity.Treatment;
import pet.care.petcare.entity.TreatmentsDiagnostics;
import pet.care.petcare.service.impl.TreatmentsDiagnosticsService;

@RestController
@RequestMapping("/rest/treatments-diagnostics")
public class TreatmentsDiagnosticsController {

    @Autowired
    private TreatmentsDiagnosticsService treatmentsDiagnosticsService;

    @GetMapping("/")
    public ResponseEntity<List<TreatmentsDiagnostics>> getAllTreatmentsDiagnostics() {
        List<TreatmentsDiagnostics> treatmentsDiagnosticsList = treatmentsDiagnosticsService.getAllTreatmentsDiagnostics();
        return ResponseEntity.ok(treatmentsDiagnosticsList);
    }

    @GetMapping("/{diagnosticId}")
    public ResponseEntity<List<Treatment>> getAllTreatments(@PathVariable Long diagnosticId) {
        List<Treatment> treatmentsList = treatmentsDiagnosticsService.getTreatmensByDiagnostic(diagnosticId);
        return ResponseEntity.ok(treatmentsList);
    }

    @PostMapping("/")
    public ResponseEntity<List<TreatmentsDiagnostics>> addTreatmentToDiagnostic(@RequestBody List<TreatmentsDiagnostics> treatmentsDiagnosticsList) {
        List<TreatmentsDiagnostics> treatmentsDiagnosticses = new ArrayList<>();
        for (TreatmentsDiagnostics treatmentsDiagnostics : treatmentsDiagnosticsList) {
            treatmentsDiagnosticses.add(treatmentsDiagnosticsService.create(treatmentsDiagnostics));
        }
        return ResponseEntity.ok(treatmentsDiagnosticses);
    }
}
