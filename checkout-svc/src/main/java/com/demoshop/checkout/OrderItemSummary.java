package com.demoshop.checkout;

import java.math.BigDecimal;

public class OrderItemSummary {
    private String productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPriceUsd;

    public OrderItemSummary(String productId, String productName, int quantity, BigDecimal unitPriceUsd) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPriceUsd = unitPriceUsd;
    }

    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitPriceUsd() { return unitPriceUsd; }
}
