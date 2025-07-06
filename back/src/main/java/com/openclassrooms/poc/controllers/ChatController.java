package com.openclassrooms.poc.controllers;

import com.openclassrooms.poc.dto.MessageDto;
import com.openclassrooms.poc.models.Contact;
import com.openclassrooms.poc.models.Message;
import com.openclassrooms.poc.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    // Récupérer les contacts de l'utilisateur connecté
    @GetMapping("/contacts/{id}")
    public ResponseEntity<List<Contact>> getContacts(@PathVariable Long id) {

        List<Contact> contacts = chatService.getContactsByUserId(id);
        return ResponseEntity.ok(contacts);
    }

    // Récupérer les messages entre deux utilisateurs
    @GetMapping("/messages/{contactId}/{ownerId}")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long contactId, @PathVariable Long ownerId) {
        List<MessageDto> messages = chatService.getMessagesBetweenUsers(ownerId, contactId);
        return ResponseEntity.ok(messages);
    }

    // Envoyer un message (via REST si besoin, en plus du WebSocket)
    @PostMapping("/messages/{contactId}")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long contactId,
            @RequestBody MessageDto messageDto) {
        Message message = chatService.sendMessage(contactId, messageDto.getSender(), messageDto.getContent());

        // Facultatif : broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + contactId, messageDto);

        return ResponseEntity.ok(message);
    }

    // WebSocket (déjà défini, mais je le remets ici pour clarté)
    @MessageMapping("/chat.sendMessage") // /app/chat.sendMessage
    public void sendMessageViaWebSocket(@RequestBody MessageDto message, Authentication authentication) {
        String senderUsername = authentication.getName();
        chatService.sendMessage(message.getContactId(), senderUsername, message.getContent());
        messagingTemplate.convertAndSend("/topic/chat/" + message.getContactId(), message);
    }

}
