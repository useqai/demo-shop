package com.demoshop.checkout;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public OrderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders supabaseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        return headers;
    }

    @SuppressWarnings("unchecked")
    public List<OrderSummary> getOrdersByEmail(String email) {
        String url = supabaseUrl + "/rest/v1/orders?email=eq." + email
            + "&select=id,email,shipping_address,total_usd,created_at,order_items(id,quantity,unit_price_usd,product_id,products(id,name))"
            + "&order=created_at.desc";

        HttpEntity<Void> request = new HttpEntity<>(supabaseHeaders());
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
            url, HttpMethod.GET, request,
            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        List<Map<String, Object>> rows = response.getBody();
        List<OrderSummary> result = new ArrayList<>();
        if (rows == null) return result;

        for (Map<String, Object> row : rows) {
            String id = (String) row.get("id");
            String rowEmail = (String) row.get("email");
            String address = (String) row.get("shipping_address");
            BigDecimal total = new BigDecimal(row.get("total_usd").toString());
            String createdAt = (String) row.get("created_at");

            List<Map<String, Object>> itemRows = (List<Map<String, Object>>) row.get("order_items");
            List<OrderItemSummary> items = new ArrayList<>();
            if (itemRows != null) {
                for (Map<String, Object> item : itemRows) {
                    Map<String, Object> product = (Map<String, Object>) item.get("products");
                    String productId = (String) item.get("product_id");
                    String productName = product != null ? (String) product.get("name") : "Unknown";
                    int qty = (Integer) item.get("quantity");
                    BigDecimal unitPrice = new BigDecimal(item.get("unit_price_usd").toString());
                    items.add(new OrderItemSummary(productId, productName, qty, unitPrice));
                }
            }
            result.add(new OrderSummary(id, rowEmail, address, total, createdAt, items));
        }
        return result;
    }
}
