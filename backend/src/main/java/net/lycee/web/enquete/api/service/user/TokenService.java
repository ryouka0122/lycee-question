package net.lycee.web.enquete.api.service.user;

import net.lycee.web.enquete.api.domain.UserId;
import org.springframework.stereotype.Service;

@Service
public class TokenService {


    public String convertToToken(UserId userId) {
        return userId.toString();
    }

    public UserId convertToId(String token) {
        return UserId.fromString(token);
    }
}
