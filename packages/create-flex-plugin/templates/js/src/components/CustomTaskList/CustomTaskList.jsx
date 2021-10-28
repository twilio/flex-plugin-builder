import React from 'react';
import PropTypes from 'prop-types';

import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props) => {
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

CustomTaskList.displayName = 'CustomTaskList';

CustomTaskList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  dismissBar: PropTypes.func.isRequired,
};

export default CustomTaskList;
