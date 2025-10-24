# File to remember the SEED data to run in new database

## List of LESSON PARENT - LESSON SEED

1. First run SEED of Lesson Parents with endpoint `lessonParent.seed.data`
2. Then run seed child lessons with endpoint `lesson.insert.pgn`.

## List of Bots

1. Run SEED endpoint to insert animal Bots in database `bot/seed-animal-bots`

## Game Piece Square

1. Run SEED endpoint to generate 32 Levels of this game

## Game World Chess Champion

1. Run SEED endpoint to generate 57 Levels.
2. Run SEED endpoint to generate games with the filename as payload (exists enum with the existing filenames)
3. When new world chess champion pgn file appears add it to existing Enum with the exact filename.

## List advanced lessons and normal lessons for PGN Viewer

1. Get always update list of `lessonAdvancedFilenames`.
2. Run the SEED endpoint to insert them `lesson/seed-all-advanced-pgn-files`;
