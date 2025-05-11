import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746899248218 implements MigrationInterface {
  name = 'Migration1746899248218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // clean and delete the rows from these two tables
    await queryRunner.query('DELETE FROM `lesson_completed`');
    await queryRunner.query('DELETE FROM `lesson`');

    await queryRunner.query(
      `CREATE TABLE \`lesson_parent\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`level\` varchar(16) NOT NULL,
      \`name\` varchar(128) NOT NULL,
      \`showHint\` tinyint NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`showHint\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`hints\` json NULL`);
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD \`lessonParentId\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_6f29732449e07226d07c44eb69\` ON \`lesson_completed\` (\`lessonId\`, \`userUid\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` ADD CONSTRAINT \`FK_a94f16fbd7c0bd44656e31d5ee2\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson\` DROP FOREIGN KEY \`FK_a94f16fbd7c0bd44656e31d5ee2\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6f29732449e07226d07c44eb69\` ON \`lesson_completed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson\` DROP COLUMN \`lessonParentId\``,
    );
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`hints\``);
    await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`showHint\``);
    await queryRunner.query(`DROP TABLE \`lesson_parent\``);
  }
}
