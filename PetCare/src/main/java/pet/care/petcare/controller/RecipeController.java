package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Recipe;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.IRecipeService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rest/recipe")
public class RecipeController {

    @Autowired
    private IRecipeService recipeService;

    @PostMapping("/")
    public ResponseEntity<?> registerRecipe(@Valid @RequestBody Recipe recipe) {
        try {
            Recipe newRecipe = recipeService.registerRecipe(recipe);
            return ResponseEntity.ok(newRecipe);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Recipe>> getAllRecipe() {
        List<Recipe> recipes = recipeService.getAllRecipe();
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        if (recipe.isPresent()) {
            return ResponseEntity.ok(recipe.get());
        } else {
            return ResponseEntity.status(404).body("Recipe not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @Valid @RequestBody Recipe updatedRecipe) {
        try {
            Recipe recipe = recipeService.updateRecipe(id,updatedRecipe);
            return ResponseEntity.ok("Recipe successfully updated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        try {
            recipeService.deleteRecipe(id);
            return ResponseEntity.ok("Recipe successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
