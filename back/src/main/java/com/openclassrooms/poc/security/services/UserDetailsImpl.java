package com.openclassrooms.poc.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

@Getter
@Builder
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

  private static final long serialVersionUID = 1L;

  private Long id;

  private String username;

  private String firstName;

  private String lastName;

  private Boolean admin;

  @JsonIgnore
  private String password;

  // 🔐 Peut évoluer selon les rôles/admins
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList(); // ou retourner des rôles
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    UserDetailsImpl user = (UserDetailsImpl) o;
    return Objects.equals(id, user.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}
