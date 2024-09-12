/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: rdds
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.23.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',2,'add_permission'),
(6,'Can change permission',2,'change_permission'),
(7,'Can delete permission',2,'delete_permission'),
(8,'Can view permission',2,'view_permission'),
(9,'Can add group',3,'add_group'),
(10,'Can change group',3,'change_group'),
(11,'Can delete group',3,'delete_group'),
(12,'Can view group',3,'view_group'),
(13,'Can add user',4,'add_user'),
(14,'Can change user',4,'change_user'),
(15,'Can delete user',4,'delete_user'),
(16,'Can view user',4,'view_user'),
(17,'Can add content type',5,'add_contenttype'),
(18,'Can change content type',5,'change_contenttype'),
(19,'Can delete content type',5,'delete_contenttype'),
(20,'Can view content type',5,'view_contenttype'),
(21,'Can add session',6,'add_session'),
(22,'Can change session',6,'change_session'),
(23,'Can delete session',6,'delete_session'),
(24,'Can view session',6,'view_session'),
(25,'Can add department',7,'add_department'),
(26,'Can change department',7,'change_department'),
(27,'Can delete department',7,'delete_department'),
(28,'Can view department',7,'view_department'),
(29,'Can add faculty',8,'add_faculty'),
(30,'Can change faculty',8,'change_faculty'),
(31,'Can delete faculty',8,'delete_faculty'),
(32,'Can view faculty',8,'view_faculty'),
(33,'Can add level',9,'add_level'),
(34,'Can change level',9,'change_level'),
(35,'Can delete level',9,'delete_level'),
(36,'Can view level',9,'view_level'),
(37,'Can add student',10,'add_student'),
(38,'Can change student',10,'change_student'),
(39,'Can delete student',10,'delete_student'),
(40,'Can view student',10,'view_student'),
(41,'Can add supervisor',11,'add_supervisor'),
(42,'Can change supervisor',11,'change_supervisor'),
(43,'Can delete supervisor',11,'delete_supervisor'),
(44,'Can view supervisor',11,'view_supervisor'),
(45,'Can add Token',12,'add_token'),
(46,'Can change Token',12,'change_token'),
(47,'Can delete Token',12,'delete_token'),
(48,'Can view Token',12,'view_token'),
(49,'Can add Token',13,'add_tokenproxy'),
(50,'Can change Token',13,'change_tokenproxy'),
(51,'Can delete Token',13,'delete_tokenproxy'),
(52,'Can view Token',13,'view_tokenproxy'),
(53,'Can add user',14,'add_user'),
(54,'Can change user',14,'change_user'),
(55,'Can delete user',14,'delete_user'),
(56,'Can view user',14,'view_user');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES
(1,'pbkdf2_sha256$870000$ITaW1mc6959LfNpvqoKZZh$tvejOmWBD9NJ5Z/2UargiLYY9dZjIQ6Edk2bIHCTQlY=','2024-08-28 08:36:45.053439',1,'umwere','','','umwerechr97@gmail.com',1,1,'2024-08-21 14:19:22.694859');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(3,'auth','group'),
(2,'auth','permission'),
(4,'auth','user'),
(12,'authtoken','token'),
(13,'authtoken','tokenproxy'),
(5,'contenttypes','contenttype'),
(7,'projects','department'),
(8,'projects','faculty'),
(9,'projects','level'),
(10,'projects','student'),
(11,'projects','supervisor'),
(14,'projects','user'),
(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2024-08-21 11:34:02.002618'),
(2,'auth','0001_initial','2024-08-21 11:34:02.224412'),
(3,'admin','0001_initial','2024-08-21 11:34:02.270656'),
(4,'admin','0002_logentry_remove_auto_add','2024-08-21 11:34:02.277534'),
(5,'admin','0003_logentry_add_action_flag_choices','2024-08-21 11:34:02.285477'),
(6,'contenttypes','0002_remove_content_type_name','2024-08-21 11:34:02.319036'),
(7,'auth','0002_alter_permission_name_max_length','2024-08-21 11:34:02.331180'),
(8,'auth','0003_alter_user_email_max_length','2024-08-21 11:34:02.342808'),
(9,'auth','0004_alter_user_username_opts','2024-08-21 11:34:02.347198'),
(10,'auth','0005_alter_user_last_login_null','2024-08-21 11:34:02.364582'),
(11,'auth','0006_require_contenttypes_0002','2024-08-21 11:34:02.365767'),
(12,'auth','0007_alter_validators_add_error_messages','2024-08-21 11:34:02.369625'),
(13,'auth','0008_alter_user_username_max_length','2024-08-21 11:34:02.380935'),
(14,'auth','0009_alter_user_last_name_max_length','2024-08-21 11:34:02.392580'),
(15,'auth','0010_alter_group_name_max_length','2024-08-21 11:34:02.409161'),
(16,'auth','0011_update_proxy_permissions','2024-08-21 11:34:02.427146'),
(17,'auth','0012_alter_user_first_name_max_length','2024-08-21 11:34:02.446859'),
(18,'projects','0001_initial','2024-08-21 11:34:02.631342'),
(19,'sessions','0001_initial','2024-08-21 11:34:02.652882'),
(20,'authtoken','0001_initial','2024-08-21 14:09:24.990244'),
(21,'authtoken','0002_auto_20160226_1747','2024-08-21 14:09:25.005454'),
(22,'authtoken','0003_tokenproxy','2024-08-21 14:09:25.007909'),
(23,'authtoken','0004_alter_tokenproxy_options','2024-08-21 14:09:25.010468'),
(24,'projects','0002_level_f_id','2024-08-21 21:44:06.380427'),
(25,'projects','0003_alter_level_options','2024-08-22 15:28:41.320186'),
(26,'projects','0004_alter_student_phone_alter_supervisor_phone_and_more','2024-08-28 07:55:05.313298'),
(27,'projects','0005_student_user_supervisor_account_user','2024-08-28 07:55:05.528852'),
(28,'projects','0006_rename_user_student_account','2024-08-28 07:55:05.623877');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES
('ovol631phktm21hoyloweer9mnga05f3','.eJxVjEEOwiAQRe_C2hAYQIpL956BDMNUqgaS0q6Md7dNutDte-__t4i4LiWunec4ZXERWpx-WUJ6ct1FfmC9N0mtLvOU5J7Iw3Z5a5lf16P9OyjYy7YGlYI-QwrgwHil2SIqD4O3HALnkXC0Gsgr8prMBjLbwWZnTALljBOfL8b4N2M:1sjEAX:mKDrOz9uYUEEkJlJPPlT1aBSe-UXrUxKzeeep4K0bV0','2024-09-11 08:36:45.055045');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_department`
--

DROP TABLE IF EXISTS `projects_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_department` (
  `dpt_id` int(11) NOT NULL AUTO_INCREMENT,
  `dpt_name` varchar(255) NOT NULL,
  PRIMARY KEY (`dpt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_department`
--

LOCK TABLES `projects_department` WRITE;
/*!40000 ALTER TABLE `projects_department` DISABLE KEYS */;
INSERT INTO `projects_department` VALUES
(1,'ICT'),
(2,'Hispitality'),
(3,'Mechanical Engineering');
/*!40000 ALTER TABLE `projects_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_faculty`
--

DROP TABLE IF EXISTS `projects_faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_faculty` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(255) NOT NULL,
  `dpt_id_id` int(11) NOT NULL,
  PRIMARY KEY (`f_id`),
  KEY `projects_faculty_dpt_id_id_593fcdb6_fk_projects_` (`dpt_id_id`),
  CONSTRAINT `projects_faculty_dpt_id_id_593fcdb6_fk_projects_` FOREIGN KEY (`dpt_id_id`) REFERENCES `projects_department` (`dpt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_faculty`
--

LOCK TABLES `projects_faculty` WRITE;
/*!40000 ALTER TABLE `projects_faculty` DISABLE KEYS */;
INSERT INTO `projects_faculty` VALUES
(3,'IT',1),
(4,'Multimedia',1),
(5,'Room Division',2),
(6,'Curinary Arts',2),
(7,'F&B',2),
(8,'Production Technology',3),
(9,'Manufacturing Technology',3);
/*!40000 ALTER TABLE `projects_faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_level`
--

DROP TABLE IF EXISTS `projects_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_level` (
  `l_id` int(11) NOT NULL AUTO_INCREMENT,
  `l_name` varchar(255) NOT NULL,
  `dpt_id_id` int(11) NOT NULL,
  `f_id_id` int(11) NOT NULL,
  PRIMARY KEY (`l_id`),
  UNIQUE KEY `projects_level_f_id_id_l_name_c803cff8_uniq` (`f_id_id`,`l_name`),
  KEY `projects_level_dpt_id_id_21933e8e_fk_projects_department_dpt_id` (`dpt_id_id`),
  CONSTRAINT `projects_level_dpt_id_id_21933e8e_fk_projects_department_dpt_id` FOREIGN KEY (`dpt_id_id`) REFERENCES `projects_department` (`dpt_id`),
  CONSTRAINT `projects_level_f_id_id_419e2705_fk_projects_faculty_f_id` FOREIGN KEY (`f_id_id`) REFERENCES `projects_faculty` (`f_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_level`
--

LOCK TABLES `projects_level` WRITE;
/*!40000 ALTER TABLE `projects_level` DISABLE KEYS */;
INSERT INTO `projects_level` VALUES
(2,'Level6 Year1',1,3),
(3,'Level6 Year2',1,3),
(4,'Level6 Year1',1,4),
(13,'Level6 Year2',1,4),
(14,'Level6 Year2',2,5);
/*!40000 ALTER TABLE `projects_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_student`
--

DROP TABLE IF EXISTS `projects_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_student` (
  `st_id` int(11) NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(10) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `profile_pic` varchar(100) NOT NULL,
  `dpt_id_id` int(11) NOT NULL,
  `f_id_id` int(11) NOT NULL,
  `l_id_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`st_id`),
  UNIQUE KEY `reg_no` (`reg_no`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `projects_student_phone_1cb17134_uniq` (`phone`),
  UNIQUE KEY `user_id` (`account_id`),
  KEY `projects_student_dpt_id_id_c6192fa9_fk_projects_` (`dpt_id_id`),
  KEY `projects_student_f_id_id_cd8ff21c_fk_projects_faculty_f_id` (`f_id_id`),
  KEY `projects_student_l_id_id_cc8daad7_fk_projects_level_l_id` (`l_id_id`),
  CONSTRAINT `projects_student_account_id_53f11505_fk_auth_user_id` FOREIGN KEY (`account_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `projects_student_dpt_id_id_c6192fa9_fk_projects_` FOREIGN KEY (`dpt_id_id`) REFERENCES `projects_department` (`dpt_id`),
  CONSTRAINT `projects_student_f_id_id_cd8ff21c_fk_projects_faculty_f_id` FOREIGN KEY (`f_id_id`) REFERENCES `projects_faculty` (`f_id`),
  CONSTRAINT `projects_student_l_id_id_cc8daad7_fk_projects_level_l_id` FOREIGN KEY (`l_id_id`) REFERENCES `projects_level` (`l_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_student`
--

LOCK TABLES `projects_student` WRITE;
/*!40000 ALTER TABLE `projects_student` DISABLE KEYS */;
INSERT INTO `projects_student` VALUES
(1,'24rp00000','UMWERE','Chriss','2024-08-22','respinho2014@gmail.com','0784389611','static/student/a099d88dc1684f4cb5a0748c02f4d8bf.jpeg',1,3,3,NULL);
/*!40000 ALTER TABLE `projects_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_supervisor`
--

DROP TABLE IF EXISTS `projects_supervisor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_supervisor` (
  `sup_id` int(11) NOT NULL AUTO_INCREMENT,
  `reg_num` varchar(8) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `profile_pic` varchar(100) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `dpt_id_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`sup_id`),
  UNIQUE KEY `reg_num` (`reg_num`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `projects_supervisor_phone_88cd2953_uniq` (`phone`),
  UNIQUE KEY `account_id` (`account_id`),
  KEY `projects_supervisor_dpt_id_id_146afe94_fk_projects_` (`dpt_id_id`),
  CONSTRAINT `projects_supervisor_account_id_edd3632a_fk_auth_user_id` FOREIGN KEY (`account_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `projects_supervisor_dpt_id_id_146afe94_fk_projects_` FOREIGN KEY (`dpt_id_id`) REFERENCES `projects_department` (`dpt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_supervisor`
--

LOCK TABLES `projects_supervisor` WRITE;
/*!40000 ALTER TABLE `projects_supervisor` DISABLE KEYS */;
INSERT INTO `projects_supervisor` VALUES
(1,'sup00000','UMWERE','Chriss','umwerechr97@gmail.com','0784389611','static/supervisor/d3b53f11c6d64aa098faf431444569fd.jpg','multimedia','HoD',1,NULL),
(2,'sup00001','UMWERE','Chriss','musabekizito@gmail.com','UMWERE12','static/supervisor/c2a59f31046c4ab49038d64fddb30cc4.jpg','multimedia','Lecturer',1,NULL),
(3,'sup00002','Kamana','mugabo','mugabo@gmail.com','0783897546','static/supervisor/414a2ab39b1f491a8f6ffa02167a7d5d.png','maintanance','Lecturer',1,NULL);
/*!40000 ALTER TABLE `projects_supervisor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_user`
--

DROP TABLE IF EXISTS `projects_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_user`
--

LOCK TABLES `projects_user` WRITE;
/*!40000 ALTER TABLE `projects_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_user_groups`
--

DROP TABLE IF EXISTS `projects_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_user_groups_user_id_group_id_554e169f_uniq` (`user_id`,`group_id`),
  KEY `projects_user_groups_group_id_64787f80_fk_auth_group_id` (`group_id`),
  CONSTRAINT `projects_user_groups_group_id_64787f80_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `projects_user_groups_user_id_6adcaa90_fk_projects_user_id` FOREIGN KEY (`user_id`) REFERENCES `projects_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_user_groups`
--

LOCK TABLES `projects_user_groups` WRITE;
/*!40000 ALTER TABLE `projects_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects_user_user_permissions`
--

DROP TABLE IF EXISTS `projects_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_user_user_permi_user_id_permission_id_ed30fad9_uniq` (`user_id`,`permission_id`),
  KEY `projects_user_user_p_permission_id_5793fcf2_fk_auth_perm` (`permission_id`),
  CONSTRAINT `projects_user_user_p_permission_id_5793fcf2_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `projects_user_user_p_user_id_e73dd49a_fk_projects_` FOREIGN KEY (`user_id`) REFERENCES `projects_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects_user_user_permissions`
--

LOCK TABLES `projects_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `projects_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 13:27:35
