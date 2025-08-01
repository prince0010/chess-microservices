import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUser1753831551196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert super_admin user by default
    await queryRunner.query(
      `INSERT INTO auth (name, username, password, gender, country, roles)
        VALUES ("Reino Digital", "admin@reinodigitalcr.com", "$2b$10$LbcgXIn94xlU.5LFdyyQ5.fm6go9J4vXyl3Xkz/UO.gQgD5.yq5Q2", "MALE", "Cuba", "SUPER_ADMIN,ADMIN");`,
    );

    // insert admin user by default
    await queryRunner.query(
      `INSERT INTO auth (name, username, password, gender, country, roles)
        VALUES ("Arkadij Naiditsch", "Arkadij", "$2b$10$oqnQLhnRgge7cyiFBD8X2.tPFvB.Qi6jVbqG8INNWnQKPma873ZrW", "MALE", "Russia", "ADMIN");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
