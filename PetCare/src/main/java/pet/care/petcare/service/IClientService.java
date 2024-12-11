package pet.care.petcare.service;

import pet.care.petcare.entity.Client;
import pet.care.petcare.entity.Pet;

import java.util.List;

public abstract class IClientService extends UserService<Client>{
    public List<Pet> getPetsByClient(Client client){
        return client.getPets();
    }
}
