import type { Meta, StoryObj } from '@storybook/react';

import Bug from './Bug';

const meta: Meta<typeof Bug> = {
  component: Bug,
};

export default meta;

type Story = StoryObj<typeof Bug>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Bug/>,
};