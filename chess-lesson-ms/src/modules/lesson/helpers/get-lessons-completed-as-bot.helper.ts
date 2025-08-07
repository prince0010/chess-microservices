import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

// bots defeated
export const getLessonsCompletedAsBot = async (
  client: ClientProxy,
  userUid: number,
): Promise<number> => {
  let lessonsCompleted = 0;

  const counter = await firstValueFrom(
    client.send('bot.count.howManyDefeated', userUid),
  );

  counter < 2 ? (lessonsCompleted = counter) : (lessonsCompleted = 2);

  return lessonsCompleted; // bots defeated
};
