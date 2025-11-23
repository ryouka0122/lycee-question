package net.lycee.web.enquete.api.service.sse;

public record SseNotifyMessage(
        String name,
        String message
) {
}
