import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751989336600 implements MigrationInterface {
  name = 'Migration1751989336600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_parent_test_record\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`lessons\` text NOT NULL,
      \`playedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`lessonParentId\` int NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_test_record\` ADD CONSTRAINT \`FK_ed7b07318ab70a52fe90431907f\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_parent_test_record\` DROP FOREIGN KEY \`FK_ed7b07318ab70a52fe90431907f\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_parent_test_record\``);
  }
}
