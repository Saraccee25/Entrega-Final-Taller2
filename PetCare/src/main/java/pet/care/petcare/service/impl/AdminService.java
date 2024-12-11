package pet.care.petcare.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.AdminEntity;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IAdminRepository;
import pet.care.petcare.service.UserService;

@Service
public class AdminService extends UserService<AdminEntity> {
    @Autowired
    private IAdminRepository adminRepository;

    @Override
    public AdminEntity insert(AdminEntity entity) throws RuntimeException {
        if (entity == null) {
            throw new ResourceNotFoundException("User information is missing");
        }
        checkExistence(entity.getUsername(), entity.getUserId());
        entity.setRole("ADMIN");
        entity.setPassword(this.cryptPasswordEncoder.encode(entity.getPassword()));
        return adminRepository.save(entity);
    }

    @Override
    public AdminEntity findById(Long id) throws RuntimeException {
        return adminRepository.findById(id).orElseThrow(() -> {
            throw new ResourceNotFoundException("Admin not found by: " + id);
        });
    }

    @Override
    public List<AdminEntity> findAll() {
        return adminRepository.findAll();
    }

    @Override
    public AdminEntity update(AdminEntity entity) throws RuntimeException {
        Optional<AdminEntity> entityFound = adminRepository.findById(entity.getUserId());

        if (entityFound.isEmpty()) {
            throw new ResourceNotFoundException("Admin not found.");
        }else {
            AdminEntity adminEntity = entityFound.get();

            if (entity.getUserId() != null) {
                adminEntity.setUserId(entity.getUserId());
            }
            if(entity.getName() != null){
                adminEntity.setName(entity.getName());
            }
            if (entity.getLastname() != null){
                adminEntity.setLastname(entity.getLastname());
            }
            if (entity.getPhoneNumber() != null){
                adminEntity.setPhoneNumber(entity.getPhoneNumber());
            }
            if (entity.getUsername() != null){
                adminEntity.setUsername(entity.getUsername());
            }
            if (entity.getPassword() != null){
                adminEntity.setPassword(this.cryptPasswordEncoder.encode(entity.getPassword()));
            }
            adminEntity.setRole("ADMIN");
            return adminRepository.save(adminEntity);
        }
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!adminRepository.existsById(id)){
            throw new ResourceNotFoundException("Admin not found");
        }
        adminRepository.deleteById(id);
    }
}
