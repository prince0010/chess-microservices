import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755529976955 implements MigrationInterface {
  name = 'Migration1755529976955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_single_record\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`status\` varchar(16) NOT NULL DEFAULT 'SUCCEEDED',
      \`playedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`lessonId\` int NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_single_record\` ADD CONSTRAINT \`FK_53b19c768ab378a81cd07163907\` FOREIGN KEY (\`lessonId\`) REFERENCES \`lesson\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_single_record\` DROP FOREIGN KEY \`FK_53b19c768ab378a81cd07163907\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_single_record\``);
  }
}
