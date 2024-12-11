package pet.care.petcare.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IClinicStaffRepository;
import pet.care.petcare.service.UserService;

@Service
public class ClinicStaffService extends UserService<ClinicStaff>{

    @Autowired
    private IClinicStaffRepository clinicStaffRepository;

    @Override
    public ClinicStaff insert(ClinicStaff entity) throws RuntimeException {
        if (entity == null) {
            throw new ResourceNotFoundException("User information is missing");
        }
        checkExistence(entity.getUsername(), entity.getUserId());
        entity.setRole("CLINIC_STAFF");
        entity.setPassword(this.cryptPasswordEncoder.encode(entity.getPassword()));
        return clinicStaffRepository.save(entity);
    }

    @Override
    public ClinicStaff findById(Long id) throws RuntimeException {
        return clinicStaffRepository.findById(id).orElseThrow(() -> {
            throw new ResourceNotFoundException("Clinic staff not found by: " + id);
        });
    }

    @Override
    public List<ClinicStaff> findAll() {
        return clinicStaffRepository.findAll();
    }

    @Override
    public ClinicStaff update(ClinicStaff entity) throws RuntimeException {
        Optional<ClinicStaff> entityFound = clinicStaffRepository.findById(entity.getUserId());

        if (entityFound.isEmpty()) {
            throw new ResourceNotFoundException("Clinic staff not found.");
        }else {
            ClinicStaff clinicStaff = entityFound.get();

            if (entity.getUserId() != null) {
                clinicStaff.setUserId(entity.getUserId());
            }
            if(entity.getName() != null){
                clinicStaff.setName(entity.getName());
            }
            if (entity.getLastname() != null){
                clinicStaff.setLastname(entity.getLastname());
            }
            if (entity.getPhoneNumber() != null){
                clinicStaff.setPhoneNumber(entity.getPhoneNumber());
            }
            if (entity.getUsername() != null){
                clinicStaff.setUsername(entity.getUsername());
            }
            if (entity.getPassword() != null){
                clinicStaff.setPassword(this.cryptPasswordEncoder.encode(entity.getPassword()));
            }
            clinicStaff.setRole("CLINIC_STAFF");
            return clinicStaffRepository.save(clinicStaff);
        }
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!clinicStaffRepository.existsById(id)){
            throw new ResourceNotFoundException("Clinic staff not found");
        }
        clinicStaffRepository.deleteById(id);
    }
}
