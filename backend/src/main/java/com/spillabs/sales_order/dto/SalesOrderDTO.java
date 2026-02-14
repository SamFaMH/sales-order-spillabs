package com.spillabs.sales_order.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SalesOrderDTO {
    private Long id;
    private Long customerId;
    private String customerName; // Optional, for display
    private String invoiceNo;
    private LocalDate invoiceDate;
    private String referenceNo;
    private String note;
    private BigDecimal totalExcl;
    private BigDecimal totalTax;
    private BigDecimal totalIncl;
    private LocalDateTime createdAt;
    private List<SalesOrderItemDTO> items;
}
