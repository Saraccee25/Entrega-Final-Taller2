package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.entity.AdminEntity;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.UserService;


@RestController
@RequestMapping("/rest/admin")
public class AdminController {
    @Autowired
    private UserService<AdminEntity> adminService;

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody AdminEntity admin) {
        try {
            AdminEntity newAdmin = adminService.insert(admin);
            return new ResponseEntity<>(newAdmin, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the User.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
