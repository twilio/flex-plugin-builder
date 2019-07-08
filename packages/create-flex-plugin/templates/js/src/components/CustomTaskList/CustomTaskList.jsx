import React from 'react';

import * as CustomTaskListStyles from './CustomTaskList.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <CustomTaskListStyles.Div>
      This is a dismissible demo component
      <CustomTaskListStyles.Accented onClick={props.dismissBar}>
        close
      </CustomTaskListStyles.Accented>
    </CustomTaskListStyles.Div>
  );
};

export default CustomTaskList;
