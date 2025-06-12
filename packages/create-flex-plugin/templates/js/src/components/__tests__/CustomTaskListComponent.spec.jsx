import React from 'react';
import { render, screen } from '@testing-library/react';

import CustomTaskList from '../CustomTaskList/CustomTaskList';

describe('CustomTaskListComponent', () => {
  it('should render demo component', () => {
    const props = {
      isOpen: true,
      dismissBar: () => undefined,
    };
    const wrapper = render(<CustomTaskList {...props} />);
    expect(wrapper.render().text()).toMatch('This is a dismissible demo component');
  });
});
