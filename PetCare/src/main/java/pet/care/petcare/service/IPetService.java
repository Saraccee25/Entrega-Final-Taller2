package pet.care.petcare.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ResourceNotFoundException;

public interface IPetService{
    public List<Pet> findByName(String name) throws RuntimeException;

    public Pet insert(Pet entity, MultipartFile file) throws ResourceNotFoundException, IOException;

    public Pet findById(Long id) throws RuntimeException;

    public List<Pet> findAll();

    public Pet update(Pet entity, MultipartFile file) throws ResourceNotFoundException, IOException;

    public void deleteById(Long id) throws RuntimeException;

}
