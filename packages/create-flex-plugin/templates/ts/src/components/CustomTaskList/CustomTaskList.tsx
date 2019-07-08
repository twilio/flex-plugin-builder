import React from 'react';

import * as CustomTaskListStyles from './CustomTaskList.Styles';
import { StateToProps, DispatchToProps } from './CustomTaskList.Container';

interface OwnProps {
  // Props passed directly to the component
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = StateToProps & DispatchToProps & OwnProps;

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props: Props) => {
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
