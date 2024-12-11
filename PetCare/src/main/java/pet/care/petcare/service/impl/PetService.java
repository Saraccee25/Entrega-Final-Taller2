package pet.care.petcare.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.service.IPetService;

@Service
public class PetService implements IPetService {
    @Autowired
    private IPetRepository petRepository;

    @Autowired
    private UploadService uploadService;

    String url = "http://localhost:8080/uploads/";

    @Override
    public Pet insert(Pet entity, MultipartFile file) throws IOException {
        if (entity == null) {
            throw new ResourceNotFoundException("Pet information is missing");
        }
        checkExistence(entity);
        entity.setImage(uploadService.saveUpload(file));
        return petRepository.save(entity);
    }

    @Override
    public Pet findById(Long id) throws RuntimeException {
        Optional<Pet> pet = petRepository.findById(id);
        
        if(pet.isEmpty()){
            throw new ResourceNotFoundException("Pet not found by: " + id);
        }else{
            Pet findPet = pet.get();
            findPet.setImage(url + findPet.getImage());
            return findPet;
        }
    }

    @Override
    public List<Pet> findAll() {
        List<Pet> pets = petRepository.findAll();
        pets = pets.stream().map(pet -> { pet.setImage(url + pet.getImage());
            return pet;
        }).collect(Collectors.toList());
        return pets;
    }

    @Override
    public Pet update(Pet entity, MultipartFile file) throws ResourceNotFoundException, IOException {
        Optional<Pet> entityFound = petRepository.findById(entity.getId());

        if (entityFound.isEmpty()) {
            throw new ResourceNotFoundException("Pet not found.");
        }else {
            Pet pet = entityFound.get();

            if (entity.getId() != null) {
                pet.setId(entity.getId());
            }
            if (entity.getName() != null) {
                pet.setName(entity.getName());
            }
            if (entity.getLastname() != null) {
                pet.setLastname(entity.getLastname());
            }
            if (entity.getAge() != null) {
                pet.setAge(entity.getAge());
            }
            if (entity.getRace() != null) {
                pet.setRace(entity.getRace());
            }
            if (entity.getWeight() != null) {
                pet.setWeight(entity.getWeight());
            }
            if (entity.getSex() != null) {
                pet.setSex(entity.getSex());
            }
            if(file != null){
                uploadService.deleteUpload(pet.getImage());
                String newImageName = uploadService.saveUpload(file);
                pet.setImage(newImageName);
            }
            return petRepository.save(pet);
        }
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!petRepository.existsById(id)){
            throw new ResourceNotFoundException("Pet not found");
        }else{
            uploadService.deleteUpload(findById(id).getName());
            petRepository.deleteById(id);
        }

    }

    @Override
    public List<Pet> findByName(String name) throws RuntimeException {
        HashSet<Pet> petsByName= new HashSet<>();
        for (Pet pets: petRepository.findAll()){
            if(pets.getName().toLowerCase().contains(name.toLowerCase())){
                petsByName.add(pets);
            }
            if(pets.getLastname().toLowerCase().contains(name.toLowerCase())){
                petsByName.add(pets);
            }
        }
        return new ArrayList<>(petsByName);
    }

    private void checkExistence(Pet newPet) {
        List<Pet> pets = findByName(newPet.getName());
        boolean validation = false;
    
        for (Pet pet : pets) {
            if (newPet.getClient().getUserId().equals(pet.getClient().getUserId())) {
                if (newPet.getName().equals(pet.getName()) &&
                    newPet.getLastname().equals(pet.getLastname()) &&
                    newPet.getAge().equals(pet.getAge()) &&
                    newPet.getRace().equals(pet.getRace()) &&
                    newPet.getWeight().equals(pet.getWeight()) &&
                    newPet.getSex().equals(pet.getSex())) {
                    validation = true;
                    break;
                }
            }
        }
    
        if (validation) {
            throw new ResourceNotFoundException("Pet already exists for this owner");
        }
    }
    

}
