package com.demoshop.checkout;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Coupon {

    public enum Type { PERCENT_OFF, FIXED_OFF }

    private final Type type;
    private final BigDecimal value;
    private final String description;

    public Coupon(Type type, BigDecimal value, String description) {
        this.type = type;
        this.value = value;
        this.description = description;
    }

    public Type getType() { return type; }
    public BigDecimal getValue() { return value; }
    public String getDescription() { return description; }

    public BigDecimal discountFor(BigDecimal subtotal) {
        if (type == Type.PERCENT_OFF) {
            return subtotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return value.min(subtotal);
    }
}
