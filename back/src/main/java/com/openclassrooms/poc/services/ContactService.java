package com.openclassrooms.poc.services;

import com.openclassrooms.poc.models.Contact;
import com.openclassrooms.poc.models.User;
import com.openclassrooms.poc.repository.ContactRepository;
import com.openclassrooms.poc.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.openclassrooms.poc.repository.UserRepository;

import java.util.Optional;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;



}
