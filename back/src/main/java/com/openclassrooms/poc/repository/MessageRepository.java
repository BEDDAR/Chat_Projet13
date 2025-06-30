package com.openclassrooms.poc.repository;

import com.openclassrooms.poc.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
