package com.openclassrooms.poc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
    private Long contactId;
    private String content;
    private String sender;
    private LocalDateTime timestamp;
}
