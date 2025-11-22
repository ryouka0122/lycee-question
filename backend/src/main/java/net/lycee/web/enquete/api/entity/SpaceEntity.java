package net.lycee.web.enquete.api.entity;

import lombok.Data;
import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;

@Data
public class SpaceEntity {
    private SpaceId id;
    private UserId ownerId;
    private String name;
    private LocalDateTime openedTime;
    private LocalDateTime closeTime;

    public static SpaceEntity of(
            SpaceId id,
            UserId ownerId,
            String name,
            LocalDateTime openedTime,
            LocalDateTime closeTime
    ) {
        SpaceEntity entity = new SpaceEntity();
        entity.setId(id);
        entity.setOwnerId(ownerId);
        entity.setName(name);
        entity.setOpenedTime(openedTime);
        entity.setCloseTime(closeTime);
        return entity;
    }
}
