-- Open Farm - Core Schema (MySQL 8)
-- Purpose: Initial schema for farms, camps, animals, movements, treatments, breeding, sales, rainfall,
--          fast-read summaries, auditing, and migrations.
-- Notes:
-- - Uses InnoDB and utf8mb4.
-- - Dates are DATE, timestamps default to CURRENT_TIMESTAMP where appropriate.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1) Identity & Access
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  locale ENUM('en','af') NOT NULL DEFAULT 'en',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS farms (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(180) NOT NULL,
  location VARCHAR(255) NOT NULL,
  hectares DECIMAL(12,2) NOT NULL,
  financial_year_start DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_farms (
  user_id BIGINT UNSIGNED NOT NULL,
  farm_id BIGINT UNSIGNED NOT NULL,
  farm_role VARCHAR(64) NOT NULL,
  PRIMARY KEY (user_id, farm_id),
  CONSTRAINT fk_user_farms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_farms_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Farm Setup & Camps
CREATE TABLE IF NOT EXISTS grazing_camps (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  hectares DECIMAL(12,2) NOT NULL,
  vegetation ENUM('mixed_veld','sweet_veld','sour_veld','cultivated_pasture','other') NOT NULL,
  quality_pct TINYINT UNSIGNED NOT NULL,
  carrying_capacity INT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_camp_name_per_farm (farm_id, name),
  CONSTRAINT fk_camps_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS camp_conditions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  camp_id BIGINT UNSIGNED NOT NULL,
  date_recorded DATE NOT NULL,
  vegetation ENUM('mixed_veld','sweet_veld','sour_veld','cultivated_pasture','other') NOT NULL,
  quality_pct TINYINT UNSIGNED NOT NULL,
  carrying_capacity INT NULL,
  notes TEXT NULL,
  recorded_by BIGINT UNSIGNED NULL,
  CONSTRAINT fk_cond_camp FOREIGN KEY (camp_id) REFERENCES grazing_camps(id) ON DELETE CASCADE,
  CONSTRAINT fk_cond_user FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Animal Core
CREATE TABLE IF NOT EXISTS animal_types (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS animal_subtypes (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  type_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  UNIQUE KEY uq_subtype_per_type (type_id, name),
  CONSTRAINT fk_subtype_type FOREIGN KEY (type_id) REFERENCES animal_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS animal (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  owner_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(40) NOT NULL, -- e.g., sheep, cattle, etc.
  subtype VARCHAR(120) NULL, -- e.g., Merino, Dorper
  tag_code VARCHAR(120) NOT NULL UNIQUE,
  sex ENUM('M','F','C') NOT NULL,
  birth_date DATE NULL,
  status ENUM('active','sold','dead','missing') NOT NULL DEFAULT 'active',
  current_camp_id BIGINT UNSIGNED NULL,
  last_move_at DATETIME NULL,
  castrated_date DATE NULL,
  sire_tag_code VARCHAR(120) NULL,
  dam_tag_code VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_animal_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_animal_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_animal_camp FOREIGN KEY (current_camp_id) REFERENCES grazing_camps(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Movements & Location History
CREATE TABLE IF NOT EXISTS animal_movements (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  movement_date DATE NOT NULL,
  type ENUM('initial','found','movement','loss') NOT NULL,
  loss_cause ENUM('predator','natural','illness','missing') NULL,
  source_camp_id BIGINT UNSIGNED NULL,
  dest_camp_id BIGINT UNSIGNED NULL,
  idempotency_key VARCHAR(120) NULL UNIQUE,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mv_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_mv_src FOREIGN KEY (source_camp_id) REFERENCES grazing_camps(id) ON DELETE SET NULL,
  CONSTRAINT fk_mv_dest FOREIGN KEY (dest_camp_id) REFERENCES grazing_camps(id) ON DELETE SET NULL,
  CONSTRAINT fk_mv_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS animal_movement_lines (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  movement_id BIGINT UNSIGNED NOT NULL,
  animal_id BIGINT UNSIGNED NOT NULL,
  days_in_source_camp INT NOT NULL,
  note VARCHAR(255) NULL,
  CONSTRAINT fk_mvl_mv FOREIGN KEY (movement_id) REFERENCES animal_movements(id) ON DELETE CASCADE,
  CONSTRAINT fk_mvl_animal FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) Health, Castration, Treatments
CREATE TABLE IF NOT EXISTS castration_events (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  event_date DATE NOT NULL,
  method ENUM('ring','surgical','other') NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ce_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_ce_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS castration_event_lines (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  castration_event_id BIGINT UNSIGNED NOT NULL,
  animal_id BIGINT UNSIGNED NOT NULL,
  CONSTRAINT fk_cel_event FOREIGN KEY (castration_event_id) REFERENCES castration_events(id) ON DELETE CASCADE,
  CONSTRAINT fk_cel_animal FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS treatments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  animal_id BIGINT UNSIGNED NOT NULL,
  treatment_date DATE NOT NULL,
  treatment_name VARCHAR(160) NOT NULL,
  treatment_type ENUM('dosing','blue_tongue','brucellosis','blood_kidney','fungicide','herbicide','pesticide','other') NOT NULL,
  next_due_date DATE NULL,
  notes TEXT NULL,
  CONSTRAINT fk_tr_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_tr_animal FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Breeding
CREATE TABLE IF NOT EXISTS breeding_matings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  sire_animal_id BIGINT UNSIGNED NULL,
  dam_animal_id BIGINT UNSIGNED NULL,
  method ENUM('natural','ai') NOT NULL,
  mating_date DATE NOT NULL,
  expected_due_date DATE NULL,
  notes TEXT NULL,
  CONSTRAINT fk_bm_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_bm_sire FOREIGN KEY (sire_animal_id) REFERENCES animal(id) ON DELETE SET NULL,
  CONSTRAINT fk_bm_dam FOREIGN KEY (dam_animal_id) REFERENCES animal(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS breeding_births (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  dam_animal_id BIGINT UNSIGNED NULL,
  mating_id BIGINT UNSIGNED NULL,
  birth_date DATE NOT NULL,
  live_births INT NOT NULL,
  stillbirths INT NOT NULL DEFAULT 0,
  notes TEXT NULL,
  CONSTRAINT fk_bb_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_bb_dam FOREIGN KEY (dam_animal_id) REFERENCES animal(id) ON DELETE SET NULL,
  CONSTRAINT fk_bb_mating FOREIGN KEY (mating_id) REFERENCES breeding_matings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) Commerce (Sales)
CREATE TABLE IF NOT EXISTS sales (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  sale_date DATE NOT NULL,
  buyer_name VARCHAR(180) NULL,
  price_total DECIMAL(14,2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'ZAR',
  notes TEXT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_sales_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sale_lines (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  sale_id BIGINT UNSIGNED NOT NULL,
  animal_id BIGINT UNSIGNED NOT NULL,
  price_each DECIMAL(14,2) NULL,
  CONSTRAINT fk_sale_lines_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_lines_animal FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8) Environment (Rainfall)
CREATE TABLE IF NOT EXISTS rainfall (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  rain_date DATE NOT NULL,
  mm DECIMAL(8,2) NOT NULL,
  notes VARCHAR(255) NULL,
  UNIQUE KEY uq_rain_per_day (farm_id, rain_date),
  CONSTRAINT fk_rain_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9) Fast Reads
CREATE TABLE IF NOT EXISTS inventory_balances (
  farm_id BIGINT UNSIGNED NOT NULL,
  camp_id BIGINT UNSIGNED NULL,
  owner_id BIGINT UNSIGNED NULL,
  type VARCHAR(40) NOT NULL,
  subtype VARCHAR(120) NULL,
  sex ENUM('M','F','C') NOT NULL,
  age_bucket VARCHAR(16) NOT NULL,
  headcount INT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (farm_id, camp_id, owner_id, type, sex, age_bucket, subtype),
  CONSTRAINT fk_inv_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_camp FOREIGN KEY (camp_id) REFERENCES grazing_camps(id) ON DELETE SET NULL,
  CONSTRAINT fk_inv_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS daily_snapshot (
  farm_id BIGINT UNSIGNED NOT NULL,
  camp_id BIGINT UNSIGNED NOT NULL,
  owner_id BIGINT UNSIGNED NULL,
  date DATE NOT NULL,
  type VARCHAR(40) NOT NULL,
  sex ENUM('M','F','C') NOT NULL,
  age_bucket VARCHAR(16) NOT NULL,
  headcount INT NOT NULL,
  PRIMARY KEY (farm_id, camp_id, owner_id, date, type, sex, age_bucket),
  CONSTRAINT fk_snap_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  CONSTRAINT fk_snap_camp FOREIGN KEY (camp_id) REFERENCES grazing_camps(id) ON DELETE CASCADE,
  CONSTRAINT fk_snap_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10) Audit & Ops
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  farm_id BIGINT UNSIGNED NULL,
  action VARCHAR(64) NOT NULL,
  entity VARCHAR(64) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_audit_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS migrations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  migration VARCHAR(180) NOT NULL UNIQUE,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed standard roles (idempotent)
INSERT INTO roles (name)
SELECT r.name FROM (
  SELECT 'admin' AS name UNION ALL
  SELECT 'farm_owner' UNION ALL
  SELECT 'farm_manager' UNION ALL
  SELECT 'farm_worker' UNION ALL
  SELECT 'farm_viewer' UNION ALL
  SELECT 'stock_owner'
) r
LEFT JOIN roles x ON x.name = r.name
WHERE x.id IS NULL;


