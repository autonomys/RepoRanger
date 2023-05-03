interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

type ButtonVariant = 'primary' | 'danger';

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded',
  danger: 'bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 text-white font-bold py-2 px-4 rounded',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <button {...props} className={buttonStyles[variant]}>
      {children}
    </button>
  );
};
