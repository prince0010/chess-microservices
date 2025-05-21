# Repo to launch all Chess microservices

This repo in github will host all chess Microservices.

# Steps to run all microservices with one command in development environment

1. Clone the repository if it was not made yet
2. Duplicate `.env.example` or create `.env` file in the root directory of chess-microservices and fill out environment variables.
3. Run all microservices with command `docker compose -f docker-compose.dev.yml up -d`
4. If you need to down the containers run `docker compose -f docker-compose.dev.yml down`

# Steps to insert pgn files with new structure

1. Create parent lesson if it not exists at the moment.
2. Store new pgn file/s into code and push the commit.
3. Maybe UPDATE enums or switch statement method on function where you automatically find the filename.
4. Call the endpoint from Postman (at the moment May 10) to seed the lessons.
5. Be sure to send all required body data on the endpoint to seed lessons.

# Be aware when new Level appears and for consequence new Test

1. Add points on LessonTestLength enum with the new test level length, ex: 10 | 12 | 20 | 30
2. Create new Lesson Parent as a Test of course.

# LESSONS LEVEL 1 LOGIC

1. Every lesson parent opened should track last lesson played, even if 20 lessons was completed. (Table => LessonPlayed)
2. The first time one lesson is played and completed should be stored. (Table => LessonCompleted)
3. Points earned by user should increment global score one time the lesson was completed.

# LESSONS LEVEL 2 LOGIC

## Points logic

1. Player has 30 seconds to solve the puzzle. Time is running down.
2. To solve 30-16 seconds-player gets 2 points. So solve 15-1 seconds-player gets 1 point. 3 mistakes or non solving is 0. Player needs to do it again.
3. To go to level 3, player needs to score a total of 100 points or to solve 10 puzzles in a roll correctly ( see below point 5).
4. To repeat a solved puzzles => 0 points.

5. Special rules

- If player manages to solve 3 puzzles in a roll without a mistake and within the range of 30-16 seconds, player get a bonus of 5 points.
- If 5 correct in a roll without a mistake and within 30-16 seconds player get an additional bonus of 10 points.
- If 10 correct in a roll without a mistake and within 30-16 seconds player get an additional bonus of 15 points and Level 3 is opening.
- After that again if 3 puzzles correct only 5 bonus points.
- Idea-for strong players to quickly pass the level. Like this a strong player needs to solve a total of 10 puzzles and can go to the Level 3.

## Hipotesis

Let me ask you about this pgn with 250 lessons or puzzles. That means Level 2 takes 250 puzzles in a row ?

So if it is 250 puzzles consecutively, it is impossible to reach that. Let me explain this logic to you or correct me. Suppose these scenarios:

1. The strongest player plays 10 correct puzzles in a row and done, he passes Level 2 and opens Level 3
2. Largest sequence:
   > player assert 9 puzzles within 15 seconds (making the largest road) and then the 10th puzzle he assert but not in less than 15 seconds so he could not open Level 3 (counter === 10)
   > player assert again 9 puzzles within 15 seconds (making the largest road) and then the 20th puzzle he assert but not in less than 15 seconds so he could not open Level 3 (counter === 20)
   > .
   > .
   > .
   > player assert again 9 puzzles and the last one to open Level 3 (counter === 100 played puzzles)
