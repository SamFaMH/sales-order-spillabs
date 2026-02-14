package com.spillabs.sales_order.service.interfaces;

import com.spillabs.sales_order.dto.SalesOrderDTO;
import java.util.List;

public interface SalesOrderService {
    SalesOrderDTO createOrder(SalesOrderDTO salesOrderDTO);

    SalesOrderDTO updateOrder(Long id, SalesOrderDTO salesOrderDTO);

    List<SalesOrderDTO> getAllOrders();

    SalesOrderDTO getOrderById(Long id);
}
