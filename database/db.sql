CREATE DATABASE delila_resto;

USE delila_resto;

CREATE TABLE  users (
    id INT(11) NOT NULL, 
    username VARCHAR(50) NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    token VARCHAR(128),
    role ENUM('ADMIN', 'COSTUMER')
);

ALTER TABLE users 
ADD PRIMARY KEY (id);

ALTER TABLE users
MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

--links table
CREATE TABLE products (
    id INT(11) NOT NULL,
    name VARCHAR(70) NOT NULL, 
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    photo BLOB NOT NULL
)

ALTER TABLE products
ADD PRIMARY KEY (id);

ALTER TABLE products
MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

DESCRIBE products;


CREATE TABLE orders (
    id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    creation_date DATE NOT NULL,
    payment_kind VARCHAR(50) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    status ENUM('nuevo', 'confirmado', 'preparando', 'enviando', 'cancelado', 'entregado'),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE orders
ADD PRIMARY KEY (id);

ALTER TABLE orders
MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

DESCRIBE orders;

CREATE TABLE ordersToProducts (
    id INT(11) NOT NULL,
    order_id INT(11) NOT NULL,
    product_id INT(11) NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);

ALTER TABLE ordersToProducts
ADD PRIMARY KEY (id);

ALTER TABLE ordersToProducts
MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

