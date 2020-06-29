import React, { useContext } from 'react';
import { AlbumsContext } from '../../../../services/AlbumsContext';
import SidebarAlbum from '../SidebarAlbum';

const SideBar = () => {
    const albums = useContext(AlbumsContext)?.albums || [];

    const sideBarAlbums = Object.keys(albums)
        .sort()
        .map((thisAlbum, index) => (
            <SidebarAlbum album={thisAlbum} key={index} />
        ));

    return <div>{sideBarAlbums}</div>;
};

export default SideBar;
