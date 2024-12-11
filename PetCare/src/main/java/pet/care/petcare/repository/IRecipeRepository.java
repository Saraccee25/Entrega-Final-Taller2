package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Recipe;

@Repository
public interface IRecipeRepository extends JpaRepository<Recipe, Long> {
}
