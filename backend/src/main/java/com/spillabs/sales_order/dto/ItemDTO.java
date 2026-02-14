package com.spillabs.sales_order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemDTO {
    private Long id;
    private String code;
    private String description;
    private BigDecimal price;
    private LocalDateTime createdAt;
}
