import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../states/CustomTaskListState';
import CustomTaskListComponent from '../components/CustomTaskListComponent';

const mapStateToProps = (state) => {
  return {
    isOpen: state.{{pluginNamespace}}.customTaskList.isOpen,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissBar: bindActionCreators(Actions.dismissBar, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTaskListComponent);
