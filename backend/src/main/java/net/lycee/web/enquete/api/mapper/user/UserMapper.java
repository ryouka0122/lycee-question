package net.lycee.web.enquete.api.mapper.user;

import net.lycee.web.enquete.api.domain.UserId;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface UserMapper {

    void insert(UserId userId);

    Optional<UserSearchResult> search(UserId userId);

}
