//// src/main/java/.../repositories/ClientRepository.java
//package com.marketrack_back.repositories;
//
//import com.marketrack_back.entities.Client;
//import org.springframework.data.domain.*;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface ClientRepository extends JpaRepository<Client, Long> {
//    Page<Client> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
//            String f, String l, String e, Pageable pageable);
//}

package com.marketrack_back.repositories;

import com.marketrack_back.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    // keep your search method if you like; specs will be used for targeting
}

