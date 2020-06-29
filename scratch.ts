//Puppeteer question
interface ElementIWant {
    property1: any;
    property2: any;
}

interface FormattedElementIWant {
    foo: any;
    bar: any;
}

const exposed = await page.evaluate(() => {
    //@ts-ignore
    return window.getPost !== undefined;
});

console.log('**** exposed is ', exposed);

!exposed && (await page.exposeFunction('getPost', getPost));

const typeOfGetPost = await page.evaluate(() => {
    //@ts-ignore
    return typeof window.getPost;
});

console.log(`type of getPost is`, typeOfGetPost);

const arrayOfElementsIWant = [...document.getElementsByClassName('whatever')];

//@ts-ignore
const mappedElementsIWant: ElementIWant[] = arrayOfElementsIwant.map(
    (el: ElementIWant): FormattedElementIWant => {
        const foo = el.property1.toString();
        const bar = Number(el.property2);

        return {
            foo,
            bar,
        };
    }
);
