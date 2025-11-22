package net.lycee.web.enquete.api.domain;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Nonnull;
import org.springframework.web.bind.WebDataBinder;

import java.util.UUID;

public record UserId(
        @JsonValue
        UUID value
) {
    public static UserId fromString(String value) {
        return new UserId(UUID.fromString(value));
    }

    @Override
    @Nonnull
    public String toString() {
        return value.toString();
    }

    public static void register(WebDataBinder binder) {
        binder.registerCustomEditor(UserId.class, new UserIdEditor());
    }

}
