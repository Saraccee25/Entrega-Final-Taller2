package pet.care.petcare.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.entity.Treatment;
import pet.care.petcare.entity.TreatmentsDiagnostics;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IDiagnosticRepository;
import pet.care.petcare.repository.ITreatmentDiagnosticRepository;
import pet.care.petcare.repository.ITreatmentRepository;

@Service
public class TreatmentsDiagnosticsService {

    @Autowired
    private ITreatmentDiagnosticRepository treatmentDiagnosticRepository;

    @Autowired
    private ITreatmentRepository treatmentRepository;

    @Autowired
    private IDiagnosticRepository diagnosticRepository;
    
    public TreatmentsDiagnostics create(TreatmentsDiagnostics treatmentsDiagnostics) throws ResourceNotFoundException {

        Diagnostic diagnostic = diagnosticRepository.findById(treatmentsDiagnostics.getDiagnostic().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic not found."));

        Treatment treatment = treatmentRepository.findById(treatmentsDiagnostics.getTreatment().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Treatment not found."));      

        treatmentsDiagnostics.setDiagnostic(diagnostic);
        treatmentsDiagnostics.setTreatment(treatment);

        return treatmentDiagnosticRepository.save(treatmentsDiagnostics);
    }

    public List<TreatmentsDiagnostics> getAllTreatmentsDiagnostics() {
        return treatmentDiagnosticRepository.findAll();
    }

    public List<Treatment> getTreatmensByDiagnostic(Long diagnosticId) {
        List<Treatment> treatments = new ArrayList<>();
        for (TreatmentsDiagnostics treatmentsDiagnostics : treatmentDiagnosticRepository.findAll()) {
            if (treatmentsDiagnostics.getDiagnostic().getId().equals(diagnosticId)) {
                treatments.add(treatmentsDiagnostics.getTreatment());
            }
        }
        return treatments;
    }
}
