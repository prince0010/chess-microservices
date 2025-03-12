import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741799858796 implements MigrationInterface {
  name = 'Migration1741799858796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`lesson_completed\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`userUid\` int NOT NULL,
            \`lessonId\` int NOT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
        ALTER TABLE \`lesson_completed\`
        ADD CONSTRAINT \`FK_c3fc595483b765576400691c4f0\`
        FOREIGN KEY (\`lessonId\`)
        REFERENCES \`lesson\`(\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed\` DROP FOREIGN KEY \`FK_c3fc595483b765576400691c4f0\``,
    );
    await queryRunner.query(`DROP TABLE \`lesson_completed\``);
  }
}
