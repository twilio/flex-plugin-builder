import React from 'react';

import { Div, Accented } from './Common.Styles';
import { StateToProps, DispatchToProps } from '../containers/CustomTaskListContainer';

interface OwnProps {
  // Props passed directly to the component
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = StateToProps & DispatchToProps & OwnProps;

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskListComponent = (props: Props) => {
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
