package com.marketrack_back.services;

import com.marketrack_back.entities.Role;

import java.util.List;
import java.util.Optional;

public interface RoleServiceInterface {
    List<Role> getAllRoles();
    Optional<Role> getRoleById(Long id);
    Role createRole(Role role);
    Role updateRole(Long id, Role roleDetails);
    void deleteRole(Long id);
}