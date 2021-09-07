-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 07 sep. 2021 à 08:05
-- Version du serveur :  8.0.21
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `PostId` int UNSIGNED NOT NULL,
  `UserId` int UNSIGNED NOT NULL,
  `message` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`UserId`),
  KEY `post_id` (`PostId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `UserId` int UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `UserId`, `title`, `content`, `image_url`, `createdAt`, `updatedAt`) VALUES
(4, 24, 'Exemple Titre 1', 'Contenu exemple 1 (post sans image)', NULL, '0000-00-00 00:00:00', '2021-08-28 18:39:33'),
(5, 23, 'Exemple 2', 'Toujours sans image ', NULL, '0000-00-00 00:00:00', '2021-08-29 09:56:45'),
(6, 23, 'Essai Image', 'Essai image contenu', 'http://localhost:3000/images/Pomme_empoisonnee.jpg1630231778512.jpg', '0000-00-00 00:00:00', '2021-08-29 10:09:38'),
(8, 29, 'Créer un post', 'Tester suppression post', 'http://localhost:3000/images/Banc_des_amoureux.jpg1630582886658.jpg', '0000-00-00 00:00:00', '2021-09-02 11:41:26');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `avatar`, `bio`, `is_admin`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin', 'admin@mail.com', '$2b$10$jhcLz7Pmtg3cShtUo0Xl8uoSjJBY8FQHQU00lyINBSJTMexKSG2hS', NULL, NULL, 1, '2021-08-01 19:25:03', '2021-08-01 19:25:03'),
(23, 'Martine', 'Boulanger', 'martineboulanger@mail.com', '$2b$10$R9XR4ktFG8r8KvJ8UdiY7OC4JblnoXkb5OBQPIqswS0N97VcswDS.', 'http://localhost:3000/images/Chateau_Disney.jpg1630403758596.jpg', 'Changer ma bio ', 0, '2021-08-28 18:25:35', '2021-08-31 10:05:12'),
(24, 'Pierre', 'Dupont', 'dupontpierre@mail.com', '$2b$10$R.swPUQZQGauCDsJQlpX8uUo6W9zyehGRi/nLvoRhvfiyy3iEXTee', NULL, NULL, 0, '2021-08-28 18:39:02', '2021-08-28 18:39:02'),
(25, 'Cassandra', 'Guillet', 'cassandraguillet@gmail.com', '$2b$10$i4GlBY/Lt1juRfzxy5pJzOksUq8s6.gm5LdSQ3YNNSNz66hyfYEqe', NULL, NULL, 0, '2021-08-29 09:22:08', '2021-08-29 09:22:08'),
(29, 'Arsene', 'Lupin', 'arsenelupin@mail.com', '$2b$10$bibRFezBH6gA1PN9tO/ZkukasTkfqC9OdMKcuNdtKl9SF00YTWEqy', NULL, 'Ajouter une bio pour Arsene Lupin', 0, '2021-08-31 12:42:21', '2021-09-03 10:55:19');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comment_post_id` FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comment_user_id` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_post_user_id` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
