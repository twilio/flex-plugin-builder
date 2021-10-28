import React from 'react';

import { Alert } from '@twilio-paste/core/alert';
import { Text } from '@twilio-paste/core/text';
import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';

export default function CustomTaskList(props) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <CustomTaskListComponentStyles>
        <AlertComponent/>
    </CustomTaskListComponentStyles>
  );
};

// bar doesn't close when X clicked; the component looks totally wrong
const AlertComponent = () => (
  <Alert onDismiss={() => props.dismissBar} variant="neutral">
    <Text color="red">This is a dismissible demo component.</Text>
  </Alert>
);
