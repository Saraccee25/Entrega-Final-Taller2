package pet.care.petcare.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.entity.MedicalHistory;
import pet.care.petcare.entity.Recipe;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IDiagnosticRepository;
import pet.care.petcare.repository.IMedicalHistoryRepository;
import pet.care.petcare.repository.IRecipeRepository;
import pet.care.petcare.service.IDiagnosticService;

@Service
public class DiagnosticService implements IDiagnosticService {
    @Autowired
    private IDiagnosticRepository diagnosticRepository;

    @Autowired
    private IMedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private IRecipeRepository recipeRepository;

    @Override
    public Diagnostic create(Long medicalHistoryId, Diagnostic diagnostic) throws ResourceNotFoundException {

        MedicalHistory medicalHistory = medicalHistoryRepository.findById(medicalHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical history not found."));


        diagnostic.setMedicalHistory(medicalHistory);

        if (diagnostic.getDate() == null) {
            diagnostic.setDate(LocalDate.now());
        }

        if (diagnostic.getRecipe() != null) {
            Recipe recipe = recipeRepository.findById(diagnostic.getRecipe().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found."));
            diagnostic.setRecipe(recipe);
        }

        return diagnosticRepository.save(diagnostic);
    }



    @Override
    public List<Diagnostic> readAll() {
        return diagnosticRepository.findAll();
    }
}
