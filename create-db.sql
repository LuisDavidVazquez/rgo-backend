CREATE DATABASE IF NOT EXISTS rastreogo ;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_rastreogo';
FLUSH PRIVILEGES;

/*

USE mysql;
UPDATE user SET plugin='mysql_native_password' WHERE User='root';
FLUSH PRIVILEGES;




 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password_rastreogo';


ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_gssapi_client BY 'password_rastreogo';
*/