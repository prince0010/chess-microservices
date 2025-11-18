# Repo to launch all Chess microservices

This repo in github will host all chess Microservices.

# Steps to run all microservices with one command in development environment

1. Clone the repository if it was not made yet
2. Duplicate `.env.example` or create `.env` file in the root directory of chess-microservices and fill out environment variables.
3. Run all microservices with command `docker compose -f docker-compose.dev.yml up -d`
4. If you need to down the containers run `docker compose -f docker-compose.dev.yml down`

# How we are handling APP Version Update

1. Directory: We will use Backend-Driven Version Control. Always check in backend server if is needed some update.
2. Location: The content of this endpoint to check app version is located at chess-auth-ms in the app-version module.
3. Important: When new app update is released, modify the latestVersion and minimumRequiredVersion class property from this method at service.

# Steps to insert pgn files with new structure

1. Create parent lesson if it not exists at the moment.
2. Store new pgn file/s into code and push the commit.
3. Maybe UPDATE enums or switch statement method on function where you automatically find the filename.
4. Call the endpoint from Postman (at the moment May 10) to seed the lessons.
5. Be sure to send all required body data on the endpoint to seed lessons.

# Be aware when new Level appears and for consequence new Test

1. Add points on LessonTestLength enum with the new test level length, ex: 10 | 12 | 20 | 30
2. Create new Lesson Parent as a Test of course.

# How to remove all content inside mysql-data volume or folder in Linux from the terminal (this help to clean database)

`find . -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +`

# LESSONS LEVEL 1 LOGIC

1. Every lesson parent opened should track last lesson played, even if 20 lessons was completed. (Table => LessonPlayed)
2. The first time one lesson is played and completed should be stored. (Table => LessonCompleted)
3. Points earned by user should increment global score one time the lesson was completed.
4. To verify if a lesson_parent is completed or not was created LessonParentEnabled (it helps to determine list of lessons parents disabled or not)

# LESSONS LEVEL 2 LOGIC

## Important clarification

1. The Table `LessonParentEnabled` means that lesson parent has been completed and and the next one lesson_parent disabled property is at false.

## Points logic

1. Player has 30 seconds to solve the puzzle. Time is running down.
2. To solve 30-16 seconds-player gets 2 points. So solve 15-1 seconds-player gets 1 point. 3 mistakes or non solving is 0. Player needs to do it again.
3. To go to level 3, player needs to score a total of 100 points or to solve 10 puzzles in a roll correctly ( see below point 5).
4. To repeat a solved puzzles => 0 points.

## Failed lesson logic to track in lessons record

- When Player is completing a lesson parent needs to pass certain lessons and have 3 lives. In case the player lost those 3 lives the database needs to store the lessonId where he lost the third 3 life.

## Monitoring Server Resources with cadvisor - prometheus - grafana

1. New Files added to root directory to be able to monitoring
   `dir/
    |- prometheus.yml
    |- datasources.yml
    |- dashboard.json
    |- default.yaml
`
2. Every docker-compose file was updated with new 3 services cadvisor - prometheus and grafana
