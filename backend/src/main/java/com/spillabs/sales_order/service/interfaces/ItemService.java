package com.spillabs.sales_order.service.interfaces;

import com.spillabs.sales_order.dto.ItemDTO;
import java.util.List;

public interface ItemService {
    List<ItemDTO> getAllItems();

    ItemDTO createItem(ItemDTO itemDTO);

    ItemDTO getItemById(Long id);

    ItemDTO getItemByCode(String code);
}
