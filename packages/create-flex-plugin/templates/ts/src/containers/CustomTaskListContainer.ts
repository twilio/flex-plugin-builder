import { AppState } from '../states';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Actions } from '../states/CustomTaskListState';
import CustomTaskListComponent from '../components/CustomTaskListComponent';

export interface StateToProps {
  isOpen: boolean;
}

export interface DispatchToProps {
  dismissBar: () => void;
}

const mapStateToProps = (state: AppState): StateToProps => {
  return {
    isOpen: state.{{pluginNamespace}}.customTaskList.isOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchToProps => {
  return {
    dismissBar: bindActionCreators(Actions.dismissBar, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTaskListComponent);
