import React, { useContext } from 'react';
import SideBarAction from '../SideBarAction';
import { ActionsActionTypes } from '../../../../types/types';
import { ActionsContext } from '../../../../services/ActionsContext';

const SideBarActions = () => {
    const { dispatch, actions, action } = useContext(ActionsContext);

    return (
        <>
            {Object.entries(actions)
                //sort the entries by alphabetical order of name
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([key, { active, name }]) => {
                    const labelColor =
                        key === action ? 'green' : active ? 'blue' : undefined;

                    const selectAction = () =>
                        dispatch({
                            type: ActionsActionTypes.currentAction,
                            key,
                        });

                    return (
                        <SideBarAction
                            labelColor={labelColor}
                            name={name}
                            key={key}
                            selectAction={selectAction}
                        />
                    );
                })}
        </>
    );
};

export default SideBarActions;
