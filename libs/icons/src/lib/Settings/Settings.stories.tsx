import type { Meta, StoryObj } from '@storybook/react';

import Settings from './Settings';

const meta: Meta<typeof Settings> = {
  component: Settings,
};

export default meta;

type Story = StoryObj<typeof Settings>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Settings/>,
};