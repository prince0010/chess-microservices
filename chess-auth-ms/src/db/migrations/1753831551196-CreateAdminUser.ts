import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUser1753831551196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert super_admin user by default
    await queryRunner.query(
      `INSERT INTO auth (name, username, password, gender, country, roles)
        VALUES ("Reino Digital", "admin@reinodigitalcr.com", "$2b$10$VRMO5.NxySnPdN6QhFWTlOWXvy.mcCxZA5NsuJvKT6RMK6MX.VE76", "MALE", "Cuba", "SUPER_ADMIN,ADMIN");`,
    );

    // insert admin user by default
    await queryRunner.query(
      `INSERT INTO auth (name, username, password, gender, country, roles)
        VALUES ("Arkadij Naiditsch", "Arkadij", "$2b$10$LBSLTL3PmpscV3TeffhjL.fOMEC2GKOtDZAW2mh8rfJZ6H7LXWHia", "MALE", "Russia", "ADMIN");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
