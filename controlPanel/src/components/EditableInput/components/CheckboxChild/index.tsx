import React from 'react';
import { Checkbox } from 'semantic-ui-react';

const CheckboxChild = ({
    handleBlur,
    value,
}: {
    handleBlur: (arg: boolean) => void;
    value?: string | boolean;
}) => (
    <Checkbox
        data-testid="status"
        checked={!!value}
        onChange={(e, { checked }) => handleBlur(!!checked)}
    />
);

export default CheckboxChild;
