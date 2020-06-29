import { Page, ElementHandle } from 'puppeteer';
import { controlPanel, showThread } from '../../Urls';
import { getThreadsArray } from '../../../../services/Config/Threads';
import { ArrayThread } from '../../../../types';

const _unbookmarkThread = async ({
    threadId,
    page,
}: {
    threadId: number;
    page: Page;
}) => {
    //the bookmark page without the rest of the usercp
    const bookmarkThreads =
        'https://forums.somethingawful.com/bookmarkthreads.php';

    //navigate to the bookmark page
    await page.goto(bookmarkThreads, {
        waitUntil: 'networkidle0',
    });

    const clickedButton = await page.evaluate(async (threadId) => {
        //the normal click() method doesn't work on this button
        //you have to create the event to accurately simulate the real clikc
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        //start by getting an array of all threads
        const removeButton = [...document.getElementsByClassName('thread')]
            //find the thread container
            ?.find((el) => el.id === `thread${threadId}`)
            //find the remove button, which is actually the div inside the button element
            ?.querySelector('[title="Remove bookmark"]'); //whichever element you want to click

        //if we didn't find the button, fail here
        if (!removeButton) return false;

        //if we have a removeButton then dispatch the event
        removeButton && removeButton.dispatchEvent(event);

        return true;
    }, threadId);

    //if we didn't click the button, fail
    if (!clickedButton) return false;

    //refresh the page, because AFAIK
    //the simulated click event doesn't trigger getting rid of the thread
    await page.reload({ waitUntil: ['networkidle0'] });

    //evaluate the page and look for the thread element
    const unbookmarked = await page.evaluate(async (threadId) => {
        const threads = [...document.getElementsByClassName('thread')];
        const thread = threads.find((el) => el.id === `thread${threadId}`);

        //if the thread element doesn't exist, it has been unbookmarked
        return thread === undefined;
    }, threadId);

    return unbookmarked;
};

const unbookmarkThread = async (threadId: number) => {
    //get a browser but WITH JavaScript active
    //the remove thread button is put on the page using javascript
    //so if we don't leave javascript active, no button to click
    //const page = (await setupAndLogin(true))?.page;
    //if (!page) return undefined;

    //const unbookmarked = await _unbookmarkThread({ threadId, page });
    const unbookmarked = true;
    return unbookmarked;
};

export default unbookmarkThread;
