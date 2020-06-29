import React from 'react';
import { Header, Image } from 'semantic-ui-react';
import { SAUser } from '../../types/types';

const User = ({ avatar, name, regDate, title }: SAUser) => (
    <div>
        <Header h1 content={name} />
        {regDate}
        <br />
        <br />
        {avatar && <Image src={avatar} />}
        {title}
    </div>
);

export default User;
