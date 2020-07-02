import getSearchablePage from '../GetSearchablePage';
import { getCookieString } from '../../../../services/Config';
import { baseUrl } from '../../Urls';

const checkProbation = async () => {
    const cookie = await getCookieString();
    const url = baseUrl;
    if (!cookie) return undefined;

    const $ = await getSearchablePage({
        cookie,
        url,
    });

    const onProbation = $.exists('#probation_warn');

    return onProbation;
};

export default checkProbation;
