package net.lycee.web.enquete.api.repository.space;

import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;

public record QesSpace(
        SpaceId spaceId,
        UserId ownerId,
        String name,
        LocalDateTime openedTime,
        LocalDateTime closeTime
) {
}
