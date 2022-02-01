import cx from 'classnames';
import Icon, { IconProps } from './Icon';
import './Button.css';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: IconProps['name'];
  color?: 'primary' | 'secondary';
}

export default function Button({
  type = 'button',
  children,
  className,
  icon,
  color = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={cx('custom-button', className, color)}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
