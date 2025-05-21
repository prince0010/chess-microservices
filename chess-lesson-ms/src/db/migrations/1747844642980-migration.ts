import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747844642980 implements MigrationInterface {
  name = 'Migration1747844642980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_parent_enabled\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`lessonParentId\` int NOT NULL,
      UNIQUE INDEX \`IDX_42bba1823d417a28b2267612bc\` (\`lessonParentId\`, \`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_enabled\` ADD CONSTRAINT \`FK_0ad376bb0e4be806fc6676de5ef\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_enabled\` DROP FOREIGN KEY \`FK_0ad376bb0e4be806fc6676de5ef\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_42bba1823d417a28b2267612bc\` ON \`lesson_parent_enabled\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_parent_enabled\``);
  }
}
