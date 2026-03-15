package com.demoshop.checkout;

import java.math.BigDecimal;
import java.util.List;

public class OrderSummary {
    private String id;
    private String email;
    private String shippingAddress;
    private BigDecimal totalUsd;
    private String createdAt;
    private List<OrderItemSummary> items;

    public OrderSummary(String id, String email, String shippingAddress,
                        BigDecimal totalUsd, String createdAt, List<OrderItemSummary> items) {
        this.id = id;
        this.email = email;
        this.shippingAddress = shippingAddress;
        this.totalUsd = totalUsd;
        this.createdAt = createdAt;
        this.items = items;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getShippingAddress() { return shippingAddress; }
    public BigDecimal getTotalUsd() { return totalUsd; }
    public String getCreatedAt() { return createdAt; }
    public List<OrderItemSummary> getItems() { return items; }
}
