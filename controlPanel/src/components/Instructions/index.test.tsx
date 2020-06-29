//React lets us create and display components to the user
//We need to import it so that we can look at the components to test them
import React from 'react';

//testing library gives us methods to test components
//we use render to look at React components
//we use cleanup to clear out memory after tests
import { render, cleanup } from '@testing-library/react';

//extend-expect gives us methods that let us say what we think a component will look like when we test it
import '@testing-library/jest-dom/extend-expect';

import Instructions from './index';

afterEach(cleanup);

it('runs without crashing', () => {
    render(<Instructions />);
});
