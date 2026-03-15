package com.demoshop.checkout;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private record UserInfo(String password, String email) {}

    private static final Map<String, UserInfo> USERS = Map.of(
        "demo",  new UserInfo("demo123",  "demo@demoshop.com"),
        "admin", new UserInfo("admin456", "admin@demoshop.com")
    );

    private final ConcurrentHashMap<String, String> tokenStore = new ConcurrentHashMap<>();

    public AuthResponse login(String username, String password) {
        UserInfo user = USERS.get(username);
        if (user == null || !user.password().equals(password)) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, username);
        return new AuthResponse(token, username, user.email());
    }

    public void logout(String token) {
        tokenStore.remove(token);
    }

    public String getUsernameForToken(String token) {
        return tokenStore.get(token);
    }
}
