//gets the page number from the url string
const getPageNumber = (url: string) =>
    Number(new URLSearchParams(url).get('pagenumber')?.split('#')[0]);

export default getPageNumber;
