import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1756418421319 implements MigrationInterface {
  name = 'Migration1756418421319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_teacher_student\` (
      \`teacherUid\` int NOT NULL,
      \`studentUid\` int NOT NULL,
      INDEX \`IDX_fb3d609a634307dd1ad7a41c7f\` (\`teacherUid\`),
      INDEX \`IDX_9580414b34811d153ed15dd17c\` (\`studentUid\`),
      PRIMARY KEY (\`teacherUid\`, \`studentUid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_student\`
      ADD CONSTRAINT \`FK_fb3d609a634307dd1ad7a41c7f8\` FOREIGN KEY (\`teacherUid\`) REFERENCES \`auth_teacher\`(\`uid\`)
      ON DELETE CASCADE
      ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_student\`
      ADD CONSTRAINT \`FK_9580414b34811d153ed15dd17c3\` FOREIGN KEY (\`studentUid\`) REFERENCES \`auth\`(\`uid\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_student\` DROP FOREIGN KEY \`FK_9580414b34811d153ed15dd17c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_teacher_student\` DROP FOREIGN KEY \`FK_fb3d609a634307dd1ad7a41c7f8\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9580414b34811d153ed15dd17c\` ON \`auth_teacher_student\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fb3d609a634307dd1ad7a41c7f\` ON \`auth_teacher_student\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_teacher_student\``);
  }
}
