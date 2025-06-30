package com.openclassrooms.poc.mapper;

import com.openclassrooms.poc.dto.UserDto;
import com.openclassrooms.poc.models.User;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDto, User> {
}
