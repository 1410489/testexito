import { Page } from '@playwright/test';

export interface Task {
  performAs(page: Page): Promise<void>;
}