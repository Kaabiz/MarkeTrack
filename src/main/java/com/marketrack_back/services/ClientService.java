package com.marketrack_back.services;

import com.marketrack_back.entities.Client;
import com.marketrack_back.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class ClientService {
    private final ClientRepository repo;

    public Page<Client> list(String q, int page, int size, String sort) {
        Pageable p = PageRequest.of(page, size, Sort.by(sort == null || sort.isBlank() ? "id" : sort).ascending());
        return (q == null || q.isBlank())
                ? repo.findAll(p)
                : repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, q, p);
    }
    public Client get(Long id){ return repo.findById(id).orElseThrow(); }
    public Client create(Client c){ return repo.save(c); }
    public Client update(Long id, Client c){
        Client x = repo.findById(id).orElseThrow();
        x.setFirstName(c.getFirstName());
        x.setLastName(c.getLastName());
        x.setEmail(c.getEmail());
        x.setGender(c.getGender());
        x.setAge(c.getAge());
        x.setOccupation(c.getOccupation());
        x.setLocation(c.getLocation());
        x.setInterests(c.getInterests());
        x.setMarketingOptIn(c.getMarketingOptIn());
        return repo.save(x);
    }
    public void delete(Long id){ repo.deleteById(id); }
}
