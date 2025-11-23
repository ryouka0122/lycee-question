package net.lycee.web.enquete.api.repository.space;

import net.lycee.web.enquete.api.entity.SpaceEntity;
import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;
import java.util.List;

public interface SpaceRepository {

    List<SpaceEntity> read(UserId userId, SpaceId spaceId);

    void insert(SpaceEntity entity);

    boolean checkOpened(SpaceId spaceId, LocalDateTime currentTime);

    void join(UserId userId, SpaceId spaceId);
}
