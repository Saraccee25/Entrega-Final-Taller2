package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Recipe;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.repository.IRecipeRepository;
import pet.care.petcare.service.IRecipeService;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService implements IRecipeService {

    @Autowired
    private IRecipeRepository recipeRepository;

    @Override
    public Recipe registerRecipe(Recipe recipe) throws ValidationException {
        if (recipe == null) {
            throw new ResourceNotFoundException("Dose information is missing");
        }
        return recipeRepository.save(recipe);
    }

    @Override
    public List<Recipe> getAllRecipe() {
        return recipeRepository.findAll();
    }

    @Override
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    @Override
    public Recipe updateRecipe(Long id, Recipe updatedRecipe) throws ResourceNotFoundException {
        Optional<Recipe> existingRecipe = recipeRepository.findById(id);
        if (existingRecipe.isPresent()) {
            Recipe recipe = existingRecipe.get();
            recipe.setId(updatedRecipe.getId());
            return recipeRepository.save(recipe);
        } else {
            throw new ResourceNotFoundException("Recipe not found");
        }
    }

    @Override
    public void deleteRecipe(Long id) throws ResourceNotFoundException {
        if (!recipeRepository.existsById(id)){
            throw new ResourceNotFoundException("Recipe not found");
        }
        recipeRepository.deleteById(id);
    }

}
