use npptinmi_websys;

--1.	Thêm table check_use_trigge, và dữ liệu
-- table check function co su dung trigger hay khong
create TABLE `check_use_trigger` (
  `id` bigint(7) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `content_update` varchar(100) DEFAULT NULL,
  `is_delete` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46593 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

insert into check_use_trigger(table_name, content_update) 
values(
'warehouse_wholesale', ''
);

-- 2.	Thêm store update_date_inventory_not_trigger

/*!50003 DROP PROCEDURE IF EXISTS `update_date_inventory_not_trigger` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`npptinmi`@`localhost` PROCEDURE `update_date_inventory_not_trigger`()
BEGIN
declare currentdate date;
		SET currentdate = current_date();
		DELETE FROM inventory_history WHERE `date` = currentdate;
		INSERT INTO inventory_history (product_id, quantity, unit, odd_quantity, odd_unit, total_value, `date`)
		SELECT p.id                                                         as product_id,
			   sum(CASE WHEN w.quantity IS NULL THEN 0 ELSE w.quantity END) as quantity,
			   w.unit,
			   IF(o.quantity IS NULL, 0, o.quantity)                        as odd_quantity,
			   o.unit                                                       as odd_unit,
			   sum( CASE WHEN w.quantity IS NULL THEN 0 ELSE w.quantity * w.price END ) as total_value,
			   currentdate
		FROM products as p
				 LEFT JOIN warehouse_wholesale as w ON p.id = w.product_id
				 LEFT JOIN warehouse_odd_product as o on w.product_id = o.product_id
		group by p.id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;


--3. Alter stoẻ update_date_inventory
/*!50003 DROP PROCEDURE IF EXISTS `update_date_inventory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`npptinmi`@`localhost` PROCEDURE `update_date_inventory`()
BEGIN
declare currentdate date;
	declare content_update_char char(50);
	set content_update_char = (select content_update from check_use_trigger where table_name = 'warehouse_wholesale');
    if content_update_char != 'update_unit' then
		SET currentdate = current_date();
		DELETE FROM inventory_history WHERE `date` = currentdate;
		INSERT INTO inventory_history (product_id, quantity, unit, odd_quantity, odd_unit, total_value, `date`)
		SELECT p.id                                                         as product_id,
			   sum(CASE WHEN w.quantity IS NULL THEN 0 ELSE w.quantity END) as quantity,
			   w.unit,
			   IF(o.quantity IS NULL, 0, o.quantity)                        as odd_quantity,
			   o.unit                                                       as odd_unit,
			   sum( CASE WHEN w.quantity IS NULL THEN 0 ELSE w.quantity * w.price END ) as total_value,
			   currentdate
		FROM products as p
				 LEFT JOIN warehouse_wholesale as w ON p.id = w.product_id
				 LEFT JOIN warehouse_odd_product as o on w.product_id = o.product_id
		group by p.id;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--4.	Inhoadon chậm: Thêm index
ALTER TABLE npptinmi_websys.order_detail ADD INDEX(order_id);

--5.
ALTER TABLE table_name DROP INDEX index_name;

--6.	Hiện trạng đơn hàng xử lý lâu:
ALTER TABLE npptinmi_websys.order ADD INDEX(delivery, shipment_id);


--7.	Tạo đơn hàng chậm
ALTER TABLE bill ADD INDEX(customer_id, debit, ignor_debit);
--8.	Sửa giá chậm tương tự 1,2,3

