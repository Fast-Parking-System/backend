-- Create the 'users' table
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    mobile VARCHAR(255),
    password VARCHAR(50),
    location_id INT,
    gender VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create the 'locations' table
CREATE TABLE locations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    tags TEXT
);

-- Create the 'transactions' table
CREATE TABLE transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount INT
);

-- Insert data into the 'locations' table
INSERT INTO locations (name, tags) VALUES
('bengkong', 'bengkong indah, bengkong laut, sadai, tanjung buntung'),
('batam kota', 'baloi permai, belian, sukajadi, sungai panas, taman baloi, teluk tering'),
('batu aji', 'bukit tempayan, buliang, kibing, tanjung uncang'),
('batu ampar', 'batu merah, kampung seraya, sungai jodoh, tanjung sengkuang'),
('belakang padang', 'kasu, pencong, pemping, pulau terong, sekanak raya, tanjung sari'),
('bulang', 'batu legong, bulang lintang, pantai gelam, pulau buluh, setokok, temoyong'),
('galang', 'air raja, galang baru, karas, pulau abang, rempang cate, sembulang, sijantung, subang mas'),
('lubuk baja', 'baloi indah, batu selicin, kampung pelita, lubuk baja kota, tanjung uma'),
('nongsa', 'batu besar, kabil, ngenang, sambau'),
('sagulung', 'sagulung kota, sungai binti, sungai langkai, sungai lekop, sungai pelunggut, tembesi'),
('sei beduk', 'duriangkang, mangsang, muka kuning, tanjung piayu'),
('sekupang', 'patam lestari, sungai harapan, tanjung pinggir, tanjung riau, tiban baru, tiban indah, tiban lama');
