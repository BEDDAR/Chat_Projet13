package com.openclassrooms.poc.controllers;

import com.openclassrooms.poc.models.Message;
import com.openclassrooms.poc.payload.request.MessageRequest;
import com.openclassrooms.poc.repository.UserRepository;
import com.openclassrooms.poc.services.ChatService;
import com.openclassrooms.poc.services.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api")
@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private UserRepository userRepository;


    // Envoyer un message (via REST si besoin, en plus du WebSocket)
    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(
            @RequestBody MessageRequest message) {

        return ResponseEntity.ok(this.chatService.sendMessage(message));

    }

    @MessageMapping("/chat.sendMessage") // /app/chat.sendMessage
    public void sendMessageViaWebSocket(@Payload MessageRequest messageRequest) {
        System.out.println("contactId " + messageRequest.getContactId());
        Message message = this.chatService.sendMessage(messageRequest);

        messagingTemplate.convertAndSend("/topic/chat/" + messageRequest.getContactId(), message);
    }

}
