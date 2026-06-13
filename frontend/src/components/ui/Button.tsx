import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  
  // Mapping varian warna
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-asgard-primary text-white hover:bg-asgard-primary/90 focus:ring-asgard-primary shadow-md hover:shadow-lg",
    secondary: "bg-asgard-secondary text-asgard-primary hover:bg-asgard-accent focus:ring-asgard-secondary shadow-md hover:shadow-lg",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-asgard-primary hover:text-asgard-primary",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
  };
  
  // Mapping ukuran
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}