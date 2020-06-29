import React, { useContext, useState } from 'react';
import { ThreadsContext } from '../../../../services/ThreadsContext';
import { Button, Label } from 'semantic-ui-react';
import { markLastRead, loadThreads } from '../../../../services/Api';

const SetLastRead = ({ threadId }: { threadId: number }) => {
    const { dispatch, threads } = useContext(ThreadsContext);
    const pages = threads?.find((t) => t.threadId === threadId)?.pages || 0;
    const [lastRead, setLastRead] = useState<number | undefined>(undefined);

    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Label size="large" content={'Set Last Read Page: '} />
            <input
                value={lastRead}
                onChange={({ target }) => {
                    const { value } = target;
                    if (!value) {
                        setLastRead(undefined);
                    } else {
                        const number = Number(value.replace(/\D/, ''));
                        setLastRead(number);
                    }
                }}
            />
            <Button
                disabled={!lastRead || lastRead > pages}
                onClick={async () =>
                    lastRead &&
                    (await markLastRead({
                        page: lastRead,
                        threadId,
                    })) &&
                    loadThreads(dispatch)
                }
            >
                Go
            </Button>
        </div>
    );
};

export default SetLastRead;
