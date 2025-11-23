package net.lycee.web.enquete.api.controller.space;

import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;

public record SpaceGetOneResponse(
        SpaceId id,
        UserId ownerId,
        String name,
        LocalDateTime openedTime,
        LocalDateTime closeTime
) {
}
