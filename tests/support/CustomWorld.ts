import fs from 'fs';
import * as playwright from 'playwright';
import { Browser, BrowserContext, Page } from 'playwright';
import { IWorldOptions, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';

export class CustomWorld {

    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    productosSeleccionados?: { nombre: string; precio: number; cantidad: number }[];
    attach!: any;

    constructor(options: IWorldOptions) {
        this.attach = options.attach;
    }

    async launchBrowser() {
        const browserType = process.env.BROWSER || 'chromium';
        this.browser = await (playwright as any)[browserType].launch({ headless: false });

        this.context = await this.browser.newContext({
            viewport: { width: 1500, height: 700 },
            recordVideo: {
                dir: 'test-result/videos/',
                size: { width: 1500, height: 700 }
            }
        });
        this.page = await this.context.newPage();

        await this.context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true
        });
    }

    async handleAttachments(scenario: any) {
        if (scenario.result?.status === 'FAILED') {
            const screenshotPath = `test-result/screenshots/imgfailed-${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            const imageBuffer = fs.readFileSync(screenshotPath);
            await this.attach(imageBuffer, 'image/png');
        }

        await this.context.tracing.stop({ path: 'traces/trace.zip' });

        const video = this.page.video();
        if (video) {
            await this.page.waitForTimeout(1000);
            await this.page.close();
            const newVideoPath = `test-result/videos/video-${Date.now()}.webm`;
            await video.saveAs(newVideoPath);
            const videoBuffer = fs.readFileSync(newVideoPath);
            await this.attach(videoBuffer, 'video/webm');
        }
    }

    async closeBrowser() {
        await this.browser.close();
    }

}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

