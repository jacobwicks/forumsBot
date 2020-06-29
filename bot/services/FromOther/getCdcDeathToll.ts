import getSearchablePage from '../FromSA/GetSearchablePage';

//the cdc us cases numbers
const url =
    'https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html';

const getDeathToll = async () => {
    try {
        const $ = await getSearchablePage({ cookie: '', url });

        const callouts = $('.callout');

        const getNewAndTotal = (text: string) => {
            //the cheerio node text contains a lot of whitespace
            //and newlines
            const arr = text
                //split on all spaces and newlines
                .split(/ |\n/)
                //filter out all spaces from the array
                .filter((v) => !!v);

            return {
                new: arr[3],
                total: arr[2],
            };
        };

        const cases = getNewAndTotal($(callouts[0]).text());

        const deaths = getNewAndTotal($(callouts[1]).text());

        return {
            cases,
            deaths,
        };
    } catch (err) {
        console.log('failed to get death toll', err);
        return undefined;
    }
};

export default getDeathToll;
