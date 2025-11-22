package net.lycee.web.enquete.utils;

import net.lycee.web.enquete.api.domain.AnswerId;
import net.lycee.web.enquete.api.domain.QuestionId;
import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class IdUtils {

    private synchronized static UUID issueIdInternal() {
        return UUID.randomUUID();
    }

    public UserId publishUserId() {
        return new UserId(issueIdInternal());
    }

    public SpaceId publishSpaceId() {
        return new SpaceId(issueIdInternal());
    }

    public QuestionId publishQuestionId() {
        return new QuestionId(issueIdInternal());
    }

    public AnswerId publishAnswerId() {
        return new AnswerId(issueIdInternal());
    }

}
