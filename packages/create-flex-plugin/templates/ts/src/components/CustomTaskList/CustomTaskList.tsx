import React from 'react';

import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';
import { StateToProps, DispatchToProps } from './CustomTaskList.Container';

interface OwnProps {
  // Props passed directly to the component
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = StateToProps & DispatchToProps & OwnProps;

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList: React.FunctionComponent<Props> = (props: Props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <CustomTaskListComponentStyles>
      This is a dismissible demo component
      <i className="accented" onClick={props.dismissBar} aria-hidden="true">
        close
      </i>
    </CustomTaskListComponentStyles>
  );
};

CustomTaskList.displayName = 'foo';

export default CustomTaskList;
