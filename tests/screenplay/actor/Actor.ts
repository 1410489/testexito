import { Page } from '@playwright/test';
import { Task } from '../tasks/TaskInterface';

export class Actor {
  constructor(private name: string, private page: Page) {}

  async attemptsTo(...tasks: Task[]) {
    for (const task of tasks) {
      await task.performAs(this.page);
    }
  }
}
