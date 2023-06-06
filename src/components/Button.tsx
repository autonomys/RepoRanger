interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

type ButtonVariant = 'primary' | 'danger' | 'secondary';

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
  danger: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
  secondary: 'bg-transparent border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded border',
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
