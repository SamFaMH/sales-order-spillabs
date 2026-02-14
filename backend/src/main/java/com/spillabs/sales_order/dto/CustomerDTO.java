package com.spillabs.sales_order.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Long id;
    private String name;
    private String address1;
    private String address2;
    private String address3;
    private String suburb;
    private String state;
    private String postCode;
    private LocalDateTime createdAt;
}
