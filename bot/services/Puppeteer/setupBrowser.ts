import puppeteer, { Page } from 'puppeteer';

const setupBrowser = async (enableJavaScript?: boolean) => {
    //create the puppeteer browser
    const browser = await puppeteer.launch();

    //instantiate a page
    const page: Page = await browser.newPage();

    //disable slow stuff
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (
            //css
            req.resourceType() == 'stylesheet' ||
            req.resourceType() == 'font' ||
            //image loading
            req.resourceType() == 'image'
        ) {
            req.abort();
        } else {
            req.continue();
        }
    });

    //if javascript isn't requested, disable it
    !enableJavaScript &&
        page.on('request', (req) => {
            if (
                //javascript
                req.resourceType() === 'script'
            ) {
                req.abort();
            } else {
                req.continue();
            }
        });

    //need the browser object to close it out when done
    return {
        browser,
        page,
    };
};

export default setupBrowser;
