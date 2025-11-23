package net.lycee.web.enquete.api.service.sse;

import net.lycee.web.enquete.api.controller.space.SpaceInfo;
import net.lycee.web.enquete.api.controller.user.UserInfo;
import net.lycee.web.enquete.api.domain.SpaceId;
import net.lycee.web.enquete.api.domain.UserId;
import net.lycee.web.enquete.api.service.space.SpaceService;
import net.lycee.web.enquete.api.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    @Value("${qes.sse.timeout.secs:1800}")
    private long sseTimeoutSecs;

    private final UserService userService;
    private final SpaceService spaceService;

    @Autowired
    public SseService(
            UserService userService,
            SpaceService spaceService) {
        this.userService = userService;
        this.spaceService = spaceService;
    }

    // 開設しているスペースに接続しているクライアントのSSE接続情報
    // 負荷が高くなってくる場合，構造自体を見直す必要あり
    private final Map<SpaceId, List<SseEmitter>> joinerEmitters = new ConcurrentHashMap<>();
    private final Map<SpaceId, List<SseEmitter>> ownerEmitters = new ConcurrentHashMap<>();

    /**
     * 接続処理
     *
     * @param spaceId スペースID
     * @param userId  接続するユーザID
     * @return SSEエミッタ
     */
    public SseEmitter connect(SpaceId spaceId, UserId userId) {
        // userIdの検証
        UserInfo userInfo = userService.readUserInfo(userId);

        // spaceIdの検証
        SpaceInfo spaceInfo = spaceService.readOne(userId, spaceId);

        Map<SpaceId, List<SseEmitter>> targetMap;
        if (spaceInfo.ownerId().equals(userId)) {
            // オーナーがスペースに接続してきた
            targetMap = ownerEmitters;
        } else {
            // 参加者がスペースに接続してきた
            targetMap = joinerEmitters;
        }

        SseEmitter emitter = new SseEmitter(sseTimeoutSecs * 1000L);

        List<SseEmitter> list = targetMap.computeIfAbsent(
                spaceId,
                k -> new CopyOnWriteArrayList<>());
        list.add(emitter);

        emitter.onCompletion(() -> cleanup(targetMap, spaceId, list, emitter));
        emitter.onTimeout(() -> cleanup(targetMap, spaceId, list, emitter));
        emitter.onError((e) -> cleanup(targetMap, spaceId, list, emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("connected"));
        } catch (IOException e) {
            list.remove(emitter);
        }
        return emitter;
    }

    private void cleanup(
            Map<SpaceId, List<SseEmitter>> targetMap,
            SpaceId spaceId,
            List<SseEmitter> emitterList,
            SseEmitter emitter) {

        emitterList.remove(emitter);
        if (emitterList.isEmpty()) {
            targetMap.remove(spaceId, emitterList);
        }
    }

    /**
     * オーナーへ通知
     *
     * @param spaceId スペースID
     * @param message メッセージオブジェクト
     */
    public void notifyMessageToOwner(SpaceId spaceId, SseNotifyMessage message) {
        List<SseEmitter> targetEmitters = ownerEmitters.get(spaceId);
        this.notifyMessageInternal(targetEmitters, message);
    }

    /**
     * 参加者へ通知
     *
     * @param spaceId スペースID
     * @param message メッセージオブジェクト
     */
    public void notifyMessageToJoiner(SpaceId spaceId, SseNotifyMessage message) {
        List<SseEmitter> targetEmitters = joinerEmitters.get(spaceId);
        this.notifyMessageInternal(targetEmitters, message);
    }

    /**
     * Broadcast処理
     *
     * @param emitterList メッセージ通知対象リスト
     * @param message     メッセージ
     */
    private void notifyMessageInternal(List<SseEmitter> emitterList, SseNotifyMessage message) {
        if (emitterList == null) {
            // スペースがない場合は終わらせる
            return;
        }

        // メッセージをbroadcast
        for (SseEmitter emitter : emitterList) {
            try {
                emitter.send(SseEmitter.event()
                        .name(message.name())
                        .data(message.message()));
            } catch (IOException e) {
                emitter.complete();
                emitterList.remove(emitter);
            }
        }
    }


}
