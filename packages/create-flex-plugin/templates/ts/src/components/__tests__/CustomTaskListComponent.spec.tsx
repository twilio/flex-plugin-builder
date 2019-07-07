import React from 'react';
import { shallow } from 'enzyme';

import CustomTaskListComponent from '../CustomTaskListComponent';

describe('CustomTaskListComponent', () => {
  it('should render demo component', () => {
    const props = {
      isOpen: true,
      dismissBar: () => undefined,
    };
    const wrapper = shallow(<CustomTaskListComponent {...props}/>);
    expect(wrapper.render().text()).toMatch('This is a dismissible demo component');
  });
});
