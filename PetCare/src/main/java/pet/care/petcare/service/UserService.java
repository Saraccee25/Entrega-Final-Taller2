package pet.care.petcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import pet.care.petcare.entity.UserEntity;
import pet.care.petcare.repository.IUserRepository;

public abstract class UserService<S extends UserEntity> implements ICRUDService<S> {
    protected BCryptPasswordEncoder cryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private IUserRepository userRepository;
    
    protected void checkExistence(String username, Long id) throws RuntimeException{
        for (UserEntity users: userRepository.findAll()){
            if(users.getUsername().equalsIgnoreCase(username)){
                throw new RuntimeException("Existing user");
            }
            if(users.getUserId().equals(id)){
                throw new RuntimeException("Existing user");
            }
        }
    }
}