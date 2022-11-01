use npptinmi_websys;

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

DROP PROCEDURE update_date_inventory;
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