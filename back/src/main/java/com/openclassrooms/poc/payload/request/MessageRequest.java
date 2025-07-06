package com.openclassrooms.poc.payload.request;

import lombok.Data;

@Data
public class MessageRequest {
    Long contactId;
    Long senderId;
    String content;
}
