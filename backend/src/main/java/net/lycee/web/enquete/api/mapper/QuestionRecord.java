package net.lycee.web.enquete.api.mapper;

import net.lycee.web.enquete.api.domain.QuestionId;
import net.lycee.web.enquete.api.domain.QuestionType;
import net.lycee.web.enquete.api.domain.SpaceId;

import java.time.LocalDateTime;

public record QuestionRecord(
        SpaceId spaceId,
        QuestionId questionId,
        Integer no,
        QuestionType type,
        String description,
        LocalDateTime endTime
) {
}
