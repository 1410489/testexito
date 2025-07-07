import { After, Before } from '@cucumber/cucumber';
import { CustomWorld } from './CustomWorld';

Before(async function (this: CustomWorld) {
  await this.launchBrowser();
});

After(async function (this: CustomWorld, scenario) {
    await this.handleAttachments(scenario);
    await this.closeBrowser();
})