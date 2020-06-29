//extend-expect gives us methods that let us say what we think a component will look like when we test it
import '@testing-library/jest-dom/extend-expect';

import checkCredentials from './checkCredentials';

const goodCredentials = {
    foo: 'bar',
};

const badCredentials = {
    bar: 'baz',
};

it('runs without crashing', async () => {
    await checkCredentials(goodCredentials);
});

it('returns true', async () => {
    const result = await checkCredentials(goodCredentials);
    expect(result).toBe(true);
});
