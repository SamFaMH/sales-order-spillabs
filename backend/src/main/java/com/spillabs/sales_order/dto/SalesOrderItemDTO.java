package com.spillabs.sales_order.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SalesOrderItemDTO {
    private Long id;
    private Long itemId;
    private String itemCode; // Optional, for display
    private String itemDescription; // Optional, for display
    private String note;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal taxRate;
    private BigDecimal exclAmount;
    private BigDecimal taxAmount;
    private BigDecimal inclAmount;
}
