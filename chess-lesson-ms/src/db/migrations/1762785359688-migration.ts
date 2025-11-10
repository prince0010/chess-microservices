import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762785359688 implements MigrationInterface {
  name = 'Migration1762785359688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_translate_description\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`target\` varchar(16) NOT NULL,
      \`hashCode\` varchar(255) NOT NULL,
      \`originalDescription\` text NOT NULL,
      \`translatedDescription\` text NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`lesson_translate_description\``);
  }
}
