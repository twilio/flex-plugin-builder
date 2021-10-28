import React from 'react';

import { Alert } from '@twilio-paste/core/alert';
import { Theme } from '@twilio-paste/core/theme';
import { Text } from '@twilio-paste/core/text';

const CustomTaskList = (props) => {
  if (!props.isOpen) {
    return null;
  }

  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <Theme.Provider theme="default">
      <Alert isOpen={isOpen} onDismiss={() => {handleClose}} variant="neutral">
        <Text>This is a dismissible demo component.</Text>
      </Alert>
    </Theme.Provider>
  );
};

export default CustomTaskList;