package com.demoshop.checkout;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CouponService {

    private static final Map<String, Coupon> COUPONS = Map.of(
        "DEMO10", new Coupon(Coupon.Type.PERCENT_OFF, BigDecimal.valueOf(10), "10% off your order"),
        "SAVE20", new Coupon(Coupon.Type.PERCENT_OFF, BigDecimal.valueOf(20), "20% off your order"),
        "FLAT5",  new Coupon(Coupon.Type.FIXED_OFF,   BigDecimal.valueOf(5),  "$5.00 off your order")
    );

    public CouponResult validate(String code, BigDecimal subtotal) {
        Coupon coupon = COUPONS.get(code.toUpperCase());
        if (coupon == null) {
            return new CouponResult(false, code, null, null, "Invalid coupon code", BigDecimal.ZERO);
        }
        BigDecimal discount = coupon.discountFor(subtotal);
        return new CouponResult(true, code.toUpperCase(), coupon.getType().name(),
            coupon.getValue(), coupon.getDescription(), discount);
    }

    public BigDecimal apply(String code, BigDecimal subtotal) {
        if (code == null || code.isBlank()) return BigDecimal.ZERO;
        Coupon coupon = COUPONS.get(code.toUpperCase());
        return coupon != null ? coupon.discountFor(subtotal) : BigDecimal.ZERO;
    }
}
