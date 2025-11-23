package net.lycee.web.enquete.api.service.question;

import net.lycee.web.enquete.api.domain.QuestionType;
import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;

import java.time.LocalDateTime;
import java.util.List;

public record QuestionCreateParam(
        UserId userId,
        SpaceId spaceId,
        QuestionType type,
        String description,
        LocalDateTime endTime,
        List<String> answers
) {
}
