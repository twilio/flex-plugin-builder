import React from 'react';
import { create, act} from 'react-test-renderer'; 
import { Text } from '@twilio-paste/core/text';
import { Alert } from '@twilio-paste/core/alert';

import CustomTaskList from '../CustomTaskList/CustomTaskList';

describe('CustomTaskList', () => {
    it('should load and display dismissable component', () => {
        const renderer = create(<CustomTaskList />);
        const root = renderer.root;

        const element = root.findByType(Alert).findByType(Text);
        expect(element.props.children).toEqual('This is a dismissible demo component.');
    });

    it('should dismiss component', () => {
        const renderer = create(<CustomTaskList />);
        const root = renderer.root;

        const element = root.findByType(Alert).findByType(Text);
        expect(element.props.children).toEqual('This is a dismissible demo component.');

        // dismiss on click
        act(root.findByType(Alert).props.onDismiss);
        expect(root.findAllByType(Alert).length).toEqual(0);
    });
});
