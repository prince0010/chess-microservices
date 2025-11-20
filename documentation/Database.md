# Clean and restart to 1 the auto-increment id

1. USE `database-name`;
2. DELETE FROM <table-name> WHERE id > 0;
3. ALTER TABLE <table-name> AUTO_INCREMENT = 1;
