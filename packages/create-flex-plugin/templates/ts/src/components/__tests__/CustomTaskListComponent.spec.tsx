import React from 'react';
import { shallow } from 'enzyme';

import CustomTaskList from '../CustomTaskList/CustomTaskList';

describe('CustomTaskListComponent', () => {
  it('should render demo component', () => {
    const props = {
      isOpen: true,
      dismissBar: () => undefined,
    };
    const wrapper = shallow(<CustomTaskList {...props} />);
    expect(wrapper.render().text()).toMatch('This is a dismissible demo component');
  });
});
