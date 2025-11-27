CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `items` (id, name, description, price, quantity) VALUES
(1, 'Keyboard', 'Mechanical RGB keyboard', 1500.00, 10),
(2, 'Mouse', 'Wireless Bluetooth mouse', 450.00, 20),
(3, 'Monitor', '24-inch IPS', 4200.00, 5);

ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
