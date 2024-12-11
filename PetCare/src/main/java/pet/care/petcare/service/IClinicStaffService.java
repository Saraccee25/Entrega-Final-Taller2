package pet.care.petcare.service;

import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;

import java.util.List;
import java.util.Optional;

public interface IClinicStaffService {

    public ClinicStaff registerClinicStaff(ClinicStaff clinicStaff) throws ValidationException;
    public List<ClinicStaff> getAllClinicStaff();
    public Optional<ClinicStaff> getClinicStaffById(Long id);
    public Optional<ClinicStaff> getClinicStaffByIdNumber(Long id);
    public ClinicStaff updateClinicStaff(Long id, ClinicStaff updatedClinicStaff) throws ResourceNotFoundException;
    void deleteClinicStaff(Long id) throws ResourceNotFoundException;

}
