package pet.care.petcare.service;

import pet.care.petcare.entity.Recipe;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;

import java.util.List;
import java.util.Optional;

public interface IRecipeService {
    public Recipe registerRecipe(Recipe recipe) throws ValidationException;
    public List<Recipe> getAllRecipe();
    public Optional<Recipe> getRecipeById(Long id);
    public Recipe updateRecipe(Long id, Recipe updatedMedication) throws ResourceNotFoundException;
    public void deleteRecipe(Long id) throws ResourceNotFoundException;
}
