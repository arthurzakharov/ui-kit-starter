import type { MouseEventHandler } from 'react';
import cn from './button.module.css';

type ButtonProps = Readonly<{
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button data-testid="button" type="button" className={cn['button']} onClick={onClick}>
      {label}
    </button>
  );
};
