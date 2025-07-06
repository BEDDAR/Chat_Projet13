package com.openclassrooms.poc.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contacts")
@Data
@Accessors(chain = true)
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(of = {"id"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties({"contacts", "createdAt", "updatedAt", "password"})
    @JoinColumn(name = "owner_id")
    private User owner;

    // L'utilisateur ajouté en tant que contact
    @ManyToOne
    @JsonIgnoreProperties({"contacts", "createdAt", "updatedAt", "password"})
    @JoinColumn(name = "contact_user_id")
    private User contactUser;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
}
