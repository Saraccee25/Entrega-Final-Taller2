package pet.care.petcare.service;

import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.entity.Treatment;
import pet.care.petcare.exception.ResourceNotFoundException;

import java.util.List;

public interface IDiagnosticService {
    public Diagnostic create(Long medicalHistoryId, Diagnostic diagnostic) throws ResourceNotFoundException;
    public List<Diagnostic> readAll();
}
