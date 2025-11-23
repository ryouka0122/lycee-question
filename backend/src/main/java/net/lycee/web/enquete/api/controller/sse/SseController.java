package net.lycee.web.enquete.api.controller.sse;

import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;
import net.lycee.web.enquete.api.service.sse.SseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/sse")
public class SseController {

    private final SseService sseService;

    public SseController(SseService sseService) {
        this.sseService = sseService;
    }

    /**
     * スペース接続API
     *
     * @param spaceId スペースID
     * @param userId  参加者ユーザID
     * @return SSEエミッタ
     */
    @GetMapping("/connect/{spaceId}")
    public SseEmitter connect(
            @PathVariable SpaceId spaceId,
            @RequestParam("userId") UserId userId
    ) {
        return sseService.connect(spaceId, userId);
    }

}
