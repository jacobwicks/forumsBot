import { useCallback, useEffect, useState } from 'react';

const useResize = (myRef: any) => {
    const getWidth = useCallback(() => myRef?.current?.offsetWidth, [myRef]);

    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            setWidth(getWidth());
        };

        if (myRef.current) {
            setWidth(getWidth());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [getWidth, myRef]);

    return width && width > 25 ? width - 25 : width;
};

export default useResize;
