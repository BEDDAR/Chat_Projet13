package com.openclassrooms.poc.services;

import com.openclassrooms.poc.models.Message;
import com.openclassrooms.poc.payload.request.MessageRequest;
import com.openclassrooms.poc.repository.ContactRepository;
import com.openclassrooms.poc.repository.MessageRepository;
import com.openclassrooms.poc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
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


    public Message sendMessage(MessageRequest messageRequest) {

        Message message = new Message();
        message.setContact(this.contactRepository.findById(messageRequest.getContactId()).orElse(null));
        message.setContent(messageRequest.getContent());
        message.setSenderId(messageRequest.getSenderId());
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

}

