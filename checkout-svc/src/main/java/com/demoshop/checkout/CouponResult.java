package com.demoshop.checkout;

import java.math.BigDecimal;

public class CouponResult {
    private final boolean valid;
    private final String code;
    private final String type;
    private final BigDecimal value;
    private final String description;
    private final BigDecimal discountAmount;

    public CouponResult(boolean valid, String code, String type, BigDecimal value,
                        String description, BigDecimal discountAmount) {
        this.valid = valid;
        this.code = code;
        this.type = type;
        this.value = value;
        this.description = description;
        this.discountAmount = discountAmount;
    }

    public boolean isValid() { return valid; }
    public String getCode() { return code; }
    public String getType() { return type; }
    public BigDecimal getValue() { return value; }
    public String getDescription() { return description; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
}
