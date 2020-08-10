CREATE TABLE covid_reports (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(100) NOT NULL,
  img_original_name VARCHAR(50),
  img_code_name VARCHAR(150),
  server VARCHAR(100),
  time_current TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);