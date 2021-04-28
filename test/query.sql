SELECT o.id, o.creation_date, o.status, o.total_amount, u.fullname, u.address, p.name, p.price, p.description 
FROM orders o INNER JOIN orderstoproducts otp ON o.id = otp.order_id INNER JOIN users u ON o.user_id = u.id
INNER JOIN products p ON otp.product_id = p.id WHERE o.id = 11;