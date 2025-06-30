package com.openclassrooms.poc.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.openclassrooms.poc.models.Message;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;

    @NonNull
    @Size(max = 50)
    @Email
    private String email;

    @NonNull
    @Size(max = 20)
    private String lastName;

    @NonNull
    @Size(max = 20)
    private String firstName;

    @NonNull
    private boolean admin;

    @JsonIgnore
    @Size(max = 120)
    private String password;

    private List<Message> messages = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
