package net.lycee.web.enquete.api.controller.space;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SpacePostRequest {
    @NotEmpty
    private String name;

    @NotNull
    private LocalDateTime closeTime;
}
