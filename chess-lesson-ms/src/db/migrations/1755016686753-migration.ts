import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755016686753 implements MigrationInterface {
  name = 'Migration1755016686753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_ed1fd86fd69581063a139e9b17\` ON \`lesson_completed_test\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` CHANGE \`level\` \`lessonParentId\` varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` DROP COLUMN \`lessonParentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` ADD \`lessonParentId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` ADD CONSTRAINT \`FK_61d25c20e3b2757c8f978adca71\` FOREIGN KEY (\`lessonParentId\`) REFERENCES \`lesson_parent\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` DROP FOREIGN KEY \`FK_61d25c20e3b2757c8f978adca71\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` DROP COLUMN \`lessonParentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` ADD \`lessonParentId\` varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_completed_test\` CHANGE \`lessonParentId\` \`level\` varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_ed1fd86fd69581063a139e9b17\` ON \`lesson_completed_test\` (\`level\`, \`userUid\`)`,
    );
  }
}
