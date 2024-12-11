package pet.care.petcare.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pet.care.petcare.entity.Client;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IClientRepository;
import pet.care.petcare.service.IClientService;

@Service
public class ClientService extends IClientService {
    @Autowired
    private IClientRepository clientRepository;

    @Override
    public Client insert(Client entity) throws RuntimeException {
        if (entity == null) {
            throw new ResourceNotFoundException("User information is missing");
        }
        checkExistence(entity.getUsername(), entity.getUserId());
        entity.setRole("CLIENT");
        return clientRepository.save(entity);
    }

    @Override
    public Client findById(Long id) throws RuntimeException {
        return clientRepository.findById(id).orElseThrow(() -> {
            throw new ResourceNotFoundException("Client not found by: " + id);
        });
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Client update(Client entity) throws RuntimeException {
        Optional<Client> entityFound = clientRepository.findById(entity.getUserId());

        if (entityFound.isEmpty()) {
            throw new ResourceNotFoundException("Client not found.");
        }else {
            Client client = entityFound.get();

            if (entity.getUserId() != null) {
                client.setUserId(entity.getUserId());
            }
            if(entity.getName() != null){
                client.setName(entity.getName());
            }
            if (entity.getLastname() != null){
                client.setLastname(entity.getLastname());
            }
            if (entity.getPhoneNumber() != null){
                client.setPhoneNumber(entity.getPhoneNumber());
            }
            if (entity.getUsername() != null){
                client.setUsername(entity.getUsername());
            }
            client.setRole("CLIENT");
            return clientRepository.save(client);
        }
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!clientRepository.existsById(id)){
            throw new ResourceNotFoundException("Client not found");
        }
        clientRepository.deleteById(id);
    }
}
