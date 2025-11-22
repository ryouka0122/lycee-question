package net.lycee.web.enquete.api.service.space;

import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;

public record SpaceRegisterDto(
        UserId userId,
        String name,
        LocalDateTime closeTime
) {
}
