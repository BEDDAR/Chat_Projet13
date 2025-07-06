package com.openclassrooms.poc.mapper;

import com.openclassrooms.poc.dto.MessageDto;
import com.openclassrooms.poc.models.Contact;
import com.openclassrooms.poc.models.Message;
import com.openclassrooms.poc.models.User;

public class MessageMapper {

    public MessageDto toDto(Message message, User connectedUser) {
        Contact contact = message.getContact();
        User owner = contact.getOwner();
        User other = contact.getContactUser();

        boolean sentByConnectedUser = (message.isSentByOwner() && owner.equals(connectedUser)) ||
                (!message.isSentByOwner() && other.equals(connectedUser));

        String sender = sentByConnectedUser ? "me" : other.getUserName();

        return new MessageDto(
                contact.getId(),
                message.getContent(),
                sender,
                message.getTimestamp()
        );
    }


}
