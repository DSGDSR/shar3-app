import type { Meta, StoryObj } from '@storybook/react';

import Command from './Command';

const meta: Meta<typeof Command> = {
  component: Command,
};

export default meta;

type Story = StoryObj<typeof Command>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Command/>,
};