package com.marketrack_back.repositories;

import com.marketrack_back.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}