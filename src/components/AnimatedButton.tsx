import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function AnimatedButton({
  children,
  onClick,
  type = 'button',
  className = '',
  icon,
  variant = 'primary'
}: AnimatedButtonProps) {
  const baseClasses = "text-center rounded-2xl h-14 relative text-black text-xl font-semibold group transition-all duration-300";
  const variantClasses = {
    primary: "bg-white",
    secondary: "bg-indigo-600 text-white"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type={type}
      onClick={onClick}
    >
      <div
        className={`${
          variant === 'primary' ? 'bg-green-400' : 'bg-indigo-700'
        } rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[92%] z-10 duration-500`}
      >
        {icon}
      </div>
      <p className="translate-x-2 relative z-20 group-hover:opacity-0 transition-opacity duration-300">
        {children}
      </p>
    </button>
  );
}