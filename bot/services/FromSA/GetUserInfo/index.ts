import { SAUser } from '../../../../types';
import { userProfile } from '../../Urls';
import getSearchablePage from '../GetSearchablePage';
import { getCookieString } from '../../../../services/Config';

const dummyUser: SAUser = {
    avatar: undefined,
    id: 0,
    name: '',
    title: undefined,
    profile: '',
    regDate: '',
};

//given userId: number
//loads user profile
//gets name, avatar, and text
//returns type SAUser
const getUserInfo = async (userId: number) => {
    const cookie = await getCookieString();

    const url = userProfile(userId);

    if (cookie && userId) {
        const $ = await getSearchablePage({
            cookie,
            url,
        });

        const userInfo = $('.userinfo');

        const username = $(userInfo).find('.author').text();

        const profile = userProfile(userId);

        const regDate = $(userInfo).find('.registered').text();

        //the avatar of the user that wrote the post
        const avatar = $($(userInfo).find('.title').find('img')[0]).attr('src');

        //custom title text of the user that wrote the post
        const title = $(userInfo).find('.title').text()?.trim();

        const user = {
            avatar,
            id: userId,
            name: username,
            profile,
            regDate,
            title,
        };

        return user;
    } else return dummyUser;
};

export default getUserInfo;
