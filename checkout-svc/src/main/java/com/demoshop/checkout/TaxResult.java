package com.demoshop.checkout;

import java.math.BigDecimal;

public class TaxResult {
    private final String state;
    private final double rate;
    private final BigDecimal taxAmount;

    public TaxResult(String state, double rate, BigDecimal taxAmount) {
        this.state = state;
        this.rate = rate;
        this.taxAmount = taxAmount;
    }

    public String getState() { return state; }
    public double getRate() { return rate; }
    public BigDecimal getTaxAmount() { return taxAmount; }
}
