package net.lycee.web.enquete.api.domain;

import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Nonnull;
import org.springframework.web.bind.WebDataBinder;

import java.util.UUID;

public record SpaceId(
        @JsonValue
        UUID value
) {
    public static SpaceId fromString(String value) {
        return new SpaceId(UUID.fromString(value));
    }

    @Override
    @Nonnull
    public String toString() {
        return value.toString();
    }

    public static void register(WebDataBinder binder) {
        binder.registerCustomEditor(SpaceId.class, new SpaceIdEditor());
    }

}
