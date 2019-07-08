import React from 'react';

import { Div, Accented } from './Common.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskListComponent = (props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <Div>
      This is a dismissible demo component
      <Accented
        onClick={props.dismissBar}
      >
        close
      </Accented>
    </Div>
  );
};

export default CustomTaskListComponent;
