package com.demoshop.checkout;

import java.math.BigDecimal;

public class CheckoutResult {
    private final String orderId;
    private final String transactionId;
    private final BigDecimal subtotal;
    private final String discountCode;
    private final BigDecimal discountAmount;
    private final String taxState;
    private final double taxRate;
    private final BigDecimal taxAmount;
    private final BigDecimal total;

    public CheckoutResult(String orderId, String transactionId,
                          BigDecimal subtotal, String discountCode, BigDecimal discountAmount,
                          String taxState, double taxRate, BigDecimal taxAmount,
                          BigDecimal total) {
        this.orderId = orderId;
        this.transactionId = transactionId;
        this.subtotal = subtotal;
        this.discountCode = discountCode;
        this.discountAmount = discountAmount;
        this.taxState = taxState;
        this.taxRate = taxRate;
        this.taxAmount = taxAmount;
        this.total = total;
    }

    public String getOrderId() { return orderId; }
    public String getTransactionId() { return transactionId; }
    public BigDecimal getSubtotal() { return subtotal; }
    public String getDiscountCode() { return discountCode; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public String getTaxState() { return taxState; }
    public double getTaxRate() { return taxRate; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public BigDecimal getTotal() { return total; }
}
