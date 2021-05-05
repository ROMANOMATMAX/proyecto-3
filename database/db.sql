-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: delila_resto
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE DATABASE delila_resto;

USE delila_resto;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `creation_date` datetime DEFAULT NULL,
  `payment_kind` varchar(50) NOT NULL,
  `total_amount` decimal(8,2) NOT NULL,
  `status` enum('nuevo','confirmado','preparando','enviando','cancelado','entregado') DEFAULT NULL,
  `address` varchar(50) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `orderstoproducts`
--

DROP TABLE IF EXISTS `orderstoproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderstoproducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(70) NOT NULL,
  `product_price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order` (`order_id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `description` text,
  `price` decimal(8,2) NOT NULL,
  `photo` blob NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'hamburguesa','pan con carne y queso',350.50,'',1),(3,'pizza','masa con queso y salsa',650.00,'',1),(4,'Milanesa','carne empanizada con pan jamon queso tomate y lechuga',380.00,'',1),(5,'Lomito','Sandwich de carne con tomate lechega jamon y queso',380.00,'',1),(6,'Milanesa Napolitana con fritas','',1100.00,'',1),(7,'Guisado','Carne, papa, zanahoria, arvejas y fideo hervido en salsa de tomate',250.00,'',0),(8,'Panqueque de avena','Con miel de caña, nueces, queso blanco y frutos secos',100.00,'',1),(9,'Wafles dulces','Con dulce de leche, garrapiñada de frutos secos y chips de chocolate',320.00,'',1),(11,'Tostado','De jamon y queso con pan artesanal',300.00,'',1),(12,'Papas crujientes','Con provenzal, panceta, huevo, parmesano y dip de queso',320.00,'',1),(13,'Café espresso 360ml','',150.00,'',1),(14,'Café con leche 360ml','',170.00,'',1),(15,'Café irlandes con ron 360ml','',290.00,'',1),(16,'Submarino 360ml','',200.00,'',1),(17,'Capuchino 360ml','',200.00,'',1),(18,'Dona','Con baño de chocolate y rellena de dulce de leche',130.00,'',1),(19,'Pancho','pan con salchicha y aderezos varios',120.00,'',1),(20,'Guisado','Carne, papa, zanahoria, arvejas y fideo hervido en salsa de tomate',250.00,'',1),(21,'mates','yerba mate un litro de agua caliente',150.00,'',1),(25,'Guisado','Carne, papa, zanahoria, arvejas y fideo hervido en salsa de tomate',250.00,'',1),(26,'Pure con carne','Carne a la olla aromatizada con finas hierbas, mas pure',200.00,'',1),(28,'Tostado','De jamon y queso con pan artesanal',300.00,'',1),(29,'Tostado','De jamon y queso con pan artesanal',300.00,'',1),(30,'1','De jamon y queso con pan artesanal',300.00,'',1),(31,'Pebete de Jamon y Queso','Pan artesanal, los mejores fiambres de la zona',500.00,'',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producttouser`
--

DROP TABLE IF EXISTS `producttouser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producttouser` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  KEY `fk_favUser` (`user_id`),
  KEY `fk_favProduct` (`product_id`),
  CONSTRAINT `fk_favProduct` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_favUser` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `token` varchar(128) DEFAULT NULL,
  `role` enum('ADMIN','COSTUMER') DEFAULT 'COSTUMER',
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'romam132','Matias Romano','romanomatias99@gmail.com','3884137627','Jose de la Iglesia 1150','123456','','COSTUMER',0),(3,'jime08','Jimena Romano','jime08@gmail.com','3884137627','Jose de la Iglesia 1150','abcdefg','','COSTUMER',1),(4,'santi16','Santi Romano','santiromas99@gmail.com','3884137627','Jose de la Iglesia 1150','adminadmin','','COSTUMER',1),(5,'sobe19','Sonia Beatriz Leon','sobeleon19@gmail.com','3887291091','Mexico 1900','holamundo12345','','COSTUMER',0),(6,'iara28','Iara Romano','iara28@gmail.com','3887291091','Barrio Huayco','holamundo12345','','COSTUMER',1),(7,'cande14','Candela Romano','candela14@gmail.com','3887291091','Barrio Cuyaya','$2a$10$CjSJ2gy0Ge7FfcF2xY4abuR8dE6SXpZIC5dxDQwslo2pU4R0IHtsW','','COSTUMER',1),(8,'papilo15','Antonio Romano','papilo15@gmail.com','3887291091','Barrio Cuyaya','$2a$10$JjN2FKcvOys8ZHwqYYWbiu3jnqtvpQ0PpusBH8Mw/I5smfa1zfvzC','','COSTUMER',0),(9,'petiso15','Ramon Romano','petiso15@gmail.com','3887291091','Barrio Alberdi','$2a$10$59VF69BcfDj9u69fyUoMz.rGjX3bSQS.iCHQ4gFSgraF2gByDjKOq','','COSTUMER',1),(10,'luca15','Luca Romano','luca15@gmail.com','3887291091','Barrio Cuyaya','$2a$10$jS3jzYH2MfxXZuaQmoZXw.7pIHC98dsMQfmBYjNCAwsOQ4NTRndYC','','COSTUMER',1),(11,'luca15','Luca Romano','luca15@gmail.com','3887291091','Barrio Cuyaya','$2a$10$zZa.m12zaelAm0Kam.pc1.NI3EABn7FS3v3n9SgnLhJdUUceRdOVO','','COSTUMER',1),(12,'flavitaro','Flavia Romano','flaviaro@gmail.com','3887291091','Barrio Huayco','$2a$10$PeyZgj4ot0y8lxlnsBZHFOQua13ei43eHg8puLaXKJvGRpLZ30T8a','','COSTUMER',1),(13,'jodidito','Roberto Romano','jodidito@gmail.com','3887291091','Barrio Alberdi','$2a$10$/QMEm8A5DAHzJm6dRsROjuAMewkQ60I4WTneMZxdAmIGpmOjLNadW','','COSTUMER',1),(16,'agusRivera','Agustina Rivera','agus@gmail.com','3887291091','Barrio Sargento Cabral','$2a$10$rGpbseusyfSmlILOuj129uCmMSwiaexGjq/Jf44pJ5wY4F8WGg3sK','','COSTUMER',1),(17,'carlita','Carla Quiroga','carlita24@gmail.com','3887291091','Barrio Chijra','$2a$10$hx./0sAaD/DJKO3Nsc9t.uVaGmw57Dn49uGaHmV6.J8v3b0lv9WHW','','COSTUMER',1),(18,'Sofi','Sofia Lopez','so@gmail.com','3887291091','Barrio Sargento Cabral','$2a$10$mhynnVOM5SgBuf2JQh9S8OvpDDF7gwd7uq8sC3eexIRp9Dxsoj.vy','','COSTUMER',1),(19,'AgusCha','Agustina Chañi','agucha@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$OjkjHqh.YERft3k7/WDlue0/5dGI1kHt3bpKKgsqam.XUlATS2YoO','','COSTUMER',1),(20,'AgusCha','Agustina Chañi','agucha2@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$YlBLjRwTyQ2Vypq3/ejnhu9/d7CYJ0woJlOS9Bt8HWIWDU6Q.7PVC','','COSTUMER',1),(21,'AgusCha','Agustina Chañi','agucha3@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$RVoA9ss8dCDYKGo6KKoioe.ovbxOqHx/IwLojW8IuXtKT6Ao9KM5W','','COSTUMER',1),(22,'AgusCha','Agustina Chañi','agucha4@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$47yrg3tfSPkfVuIilHWBi.RIaby.0W2AYvYP6akSUvSk8z4hSRS26','',NULL,1),(23,'AgusCha','Agustina Chañi','agucha5@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$7wRQhyrBzrKqOk.77XWfg.LXMzEwrLQBTmL1DcWcnUGvI3Lpk1OIW','',NULL,1),(24,'AgusCha','Agustina Chañi','agucha6@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$Mj1w4iXj72tG88tG906hqOlZH65rqEI8r9DIRD7by0D66UcIvwmpa','','ADMIN',1),(25,'AgusCha','Agustina Chañi','agucha7@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$lQuqkG3QrEfB4exu/T7B1.VxzyyaYaSMvKg5XmmOv6UVk7tVNn8si',NULL,'COSTUMER',1),(26,'AgusCha','Agustina Chañi','agucha9@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$25zDbBHjjpbdP.ytR00vFOaM5gKslUdSr5xcBgBBcfV8up3BYvVy2',NULL,'ADMIN',1),(27,'puchoRamo','Ignacio Jose Ramos','pucho@gmail.com','3887291091','Barrio Alto Comedero','$2a$10$FP/yhO5KJ2sAIX53GZ5mUev17Vv8y0oGIgy8tI7nc5X0CQFLXoQr2',NULL,'ADMIN',1),(28,'puchoRamo','Ignacio Jose Ramos','','3887291091','Barrio Alto Comedero','$2a$10$h8WDJf/trL3qvak6hbG2DOdBW2F/WEdJ6/.RsmKq7NLQII3364Ly2',NULL,'ADMIN',1),(29,'puchoRamo','Ignacio Jose Ramos','testEmail','3887291091','Barrio Alto Comedero','$2a$10$zQtQ7NJZdRCfrK7F7xft1OcHmfm2Ak1OagXiEixFjqnjeg/JjBQEK',NULL,'ADMIN',1),(30,'romam0816','Romano Matias Maximiliano','romanomatias99@outlook.com','3884137627','Jose de la Iglesia 1148','$2a$10$bOaSIO4Cd7Tx.pj16bSbmObqcsg3VSHtmAvxMSiPe.puBR1BbqkYe',NULL,'COSTUMER',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-05 17:08:37
