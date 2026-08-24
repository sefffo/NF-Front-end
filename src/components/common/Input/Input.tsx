import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
          {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
          <input id={inputId} ref={ref} className={`input-field ${leftIcon ? 'with-left-icon' : ''} ${className}`} {...props} />
          {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
        </div>
        {error ? <span className="input-error-msg">{error}</span> : helperText ? <span className="input-helper">{helperText}</span> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
