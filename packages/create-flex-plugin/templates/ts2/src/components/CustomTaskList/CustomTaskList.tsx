import React, { useState } from 'react';

import { Alert } from '@twilio-paste/core/alert';
import { Theme } from '@twilio-paste/core/theme';
import { Text } from '@twilio-paste/core/text';

const CustomTaskList = (): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) {
    return null;
  }
  
  const dismiss = () => setIsOpen(false);
  
  return (
    <Theme.Provider theme="default">
      <Alert onDismiss={dismiss} variant="neutral">
        <Text as="div">
          This is a dismissible demo component.
        </Text>
      </Alert>
    </Theme.Provider>
  );
};

CustomTaskList.displayName = 'foo';

export default CustomTaskList;
