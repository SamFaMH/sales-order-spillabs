package com.spillabs.sales_order.controller;

import com.spillabs.sales_order.dto.SalesOrderDTO;
import com.spillabs.sales_order.service.interfaces.SalesOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow cross-origin for frontend dev
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(salesOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<SalesOrderDTO> createOrder(@RequestBody SalesOrderDTO salesOrderDTO) {
        return ResponseEntity.ok(salesOrderService.createOrder(salesOrderDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> updateOrder(@PathVariable Long id, @RequestBody SalesOrderDTO salesOrderDTO) {
        return ResponseEntity.ok(salesOrderService.updateOrder(id, salesOrderDTO));
    }
}
