package com.openclassrooms.poc.services;

import com.openclassrooms.poc.models.Contact;
import com.openclassrooms.poc.models.Message;
import com.openclassrooms.poc.models.User;
import com.openclassrooms.poc.repository.ContactRepository;
import com.openclassrooms.poc.repository.MessageRepository;
import com.openclassrooms.poc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.openclassrooms.poc.dto.MessageDto;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    Date date = new Date(); // ta date existante
    LocalDateTime localDateTime = date.toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime();

    // Récupérer tous les contacts d'un utilisateur avec leurs messages
    public List<Contact> getContactsByUserId(Long userId) {
        return contactRepository.findByOwnerId(userId);
    }

    public List<MessageDto> getMessagesBetweenUsers(Long ownerId, Long contactId) {
        // 1. Vérifier que les deux utilisateurs existent
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner non trouvé : " + ownerId));

        // 2. Rechercher le contact (relation entre les deux)
        Contact contact = contactRepository
                .findByOwnerIdAndContactUserId(ownerId, contactId)
                .orElseGet(() -> contactRepository
                        .findByOwnerIdAndContactUserId(contactId, ownerId)
                        .orElseThrow(() -> new RuntimeException("Relation de contact introuvable entre les deux utilisateurs")));
        User contactUser = userRepository.findById(contact.getContactUser().getId())
                .orElseThrow(() -> new RuntimeException("Contact non trouvé : " + contactId));

        // 4. Convertir en DTO
        return contact.getMessages().stream().map(message -> {
            MessageDto dto = new MessageDto();
            dto.setContactId(contact.getId());
            dto.setContent(message.getContent());
            dto.setTimestamp(message.getTimestamp());
            dto.setSender(message.isSentByOwner()?owner.getUserName():contactUser.getUserName()); // Important ici
            return dto;
        }).collect(Collectors.toList());
    }


    // Envoyer un message (création et sauvegarde)
    public Message sendMessage(Long contactId, String senderUsername, String content) {
        Optional<Contact> contactOpt = contactRepository.findById(contactId);
        if (contactOpt.isEmpty()) {
            throw new IllegalArgumentException("Contact not found");
        }
        boolean sentByOwner = contactOpt.get().getOwner().getUserName().equals(senderUsername);

        Message message = new Message();
        message.setContact(contactOpt.get());
        message.setSentByOwner(sentByOwner);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

}

