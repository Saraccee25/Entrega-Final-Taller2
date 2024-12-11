package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Client;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.IClientService;

import java.util.List;

@RestController
@RequestMapping("/rest/client")
public class ClientController {
    @Autowired
    private IClientService clientService;

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody Client client) {
        try {
            Client newClient = clientService.insert(client);
            return new ResponseEntity<>(newClient, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the User.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pets/{clientId}")
    public ResponseEntity<List<Pet>> getAllPetsByClient(@PathVariable Long clientId) {
        List<Pet> pets = clientService.getPetsByClient(clientService.findById(clientId));
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/")
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.findAll();
        return ResponseEntity.ok(clients);
    }
}
