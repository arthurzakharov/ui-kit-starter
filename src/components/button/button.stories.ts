import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Button as Component } from './button';

const meta = {
  title: 'Button',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    label: 'Button',
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId('button')).toHaveTextContent(args.label);
    await userEvent.click(canvas.getByTestId('button'));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
