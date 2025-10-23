// src/main/java/.../controllers/ClientController.java
package com.marketrack_back.controllers;

import com.marketrack_back.entities.Client;
import com.marketrack_back.services.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController @RequestMapping("/api/clients") @RequiredArgsConstructor
public class ClientController {
    private final ClientService service;

    @GetMapping("/all")
    public Page<Client> list(@RequestParam(defaultValue = "") String q,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size,
                             @RequestParam(required = false) String sort) {
        return service.list(q, page, size, sort);
    }

    @GetMapping("/{id}") public Client get(@PathVariable Long id){ return service.get(id); }

    @PostMapping public Client create(@Valid @RequestBody Client c){ return service.create(c); }

    @PutMapping("/{id}") public Client update(@PathVariable Long id, @Valid @RequestBody Client c){ return service.update(id, c); }

    @DeleteMapping("/{id}") public void delete(@PathVariable Long id){ service.delete(id); }
}
