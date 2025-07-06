package com.openclassrooms.poc.repository;

import com.openclassrooms.poc.models.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByOwnerId(Long ownerId);
    Optional<Contact> findByOwnerIdAndContactUserId(Long ownerId, Long contactUserId);
}
