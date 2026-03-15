package com.demoshop.checkout;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TaxService {

    private static final double DEFAULT_RATE = 5.0;

    private static final Map<String, Double> STATE_RATES = Map.ofEntries(
        Map.entry("AL", 4.0),  Map.entry("AK", 0.0),  Map.entry("AZ", 5.6),
        Map.entry("AR", 6.5),  Map.entry("CA", 7.25), Map.entry("CO", 2.9),
        Map.entry("CT", 6.35), Map.entry("DE", 0.0),  Map.entry("FL", 6.0),
        Map.entry("GA", 4.0),  Map.entry("HI", 4.0),  Map.entry("ID", 6.0),
        Map.entry("IL", 6.25), Map.entry("IN", 7.0),  Map.entry("IA", 6.0),
        Map.entry("KS", 6.5),  Map.entry("KY", 6.0),  Map.entry("LA", 4.45),
        Map.entry("ME", 5.5),  Map.entry("MD", 6.0),  Map.entry("MA", 6.25),
        Map.entry("MI", 6.0),  Map.entry("MN", 6.875),Map.entry("MS", 7.0),
        Map.entry("MO", 4.225),Map.entry("MT", 0.0),  Map.entry("NE", 5.5),
        Map.entry("NV", 6.85), Map.entry("NH", 0.0),  Map.entry("NJ", 6.625),
        Map.entry("NM", 5.0),  Map.entry("NY", 4.0),  Map.entry("NC", 4.75),
        Map.entry("ND", 5.0),  Map.entry("OH", 5.75), Map.entry("OK", 4.5),
        Map.entry("OR", 0.0),  Map.entry("PA", 6.0),  Map.entry("RI", 7.0),
        Map.entry("SC", 6.0),  Map.entry("SD", 4.5),  Map.entry("TN", 7.0),
        Map.entry("TX", 6.25), Map.entry("UT", 4.85), Map.entry("VT", 6.0),
        Map.entry("VA", 4.3),  Map.entry("WA", 6.5),  Map.entry("WV", 6.0),
        Map.entry("WI", 5.0),  Map.entry("WY", 4.0)
    );

    // Matches a 2-letter US state abbreviation, e.g. ", CA " or " TX," or " NY 10001"
    private static final Pattern STATE_PATTERN = Pattern.compile(
        "\\b([A-Z]{2})\\b(?=\\s*\\d{5}|\\s*$|\\s*,)"
    );

    public TaxResult calculate(String shippingAddress, BigDecimal taxableAmount) {
        String state = extractState(shippingAddress);
        double rate = STATE_RATES.getOrDefault(state, DEFAULT_RATE);
        BigDecimal taxAmount = taxableAmount
            .multiply(BigDecimal.valueOf(rate))
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return new TaxResult(state, rate, taxAmount);
    }

    private String extractState(String address) {
        if (address == null || address.isBlank()) return "UNKNOWN";
        Matcher m = STATE_PATTERN.matcher(address.toUpperCase());
        while (m.find()) {
            String candidate = m.group(1);
            if (STATE_RATES.containsKey(candidate)) return candidate;
        }
        return "UNKNOWN";
    }
}
