package net.lycee.web.enquete.api.mapper.space;

import net.lycee.web.enquete.api.domain.UserId;
import net.lycee.web.enquete.api.entity.SpaceEntity;
import net.lycee.web.enquete.api.repository.space.QesSpace;
import net.lycee.web.enquete.api.domain.SpaceId;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface SpaceMapper {

    List<SpaceEntity> selectByUser(
            @Param("userId") UserId userId,
            @Param("spaceId") SpaceId spaceId
    );

    void insert(@Param("entity") QesSpace entity);

    SpaceEntity selectByPKAndTime(
            @Param("spaceId") SpaceId spaceId,
            @Param("currentTime") LocalDateTime currentTime
    );

    void insertJoin(
            @Param("userId") UserId userId,
            @Param("spaceId") SpaceId spaceId);

}
