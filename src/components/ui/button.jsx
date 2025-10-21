import * as React from 'react'

const Button = React.forwardRef(
  ({ variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    }

    const variants = {
      default: {
        backgroundColor: '#1877f2',
        color: '#fff',
      },
      outline: {
        border: '1px solid #d1d5db',
        backgroundColor: 'transparent',
        color: '#374151',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#374151',
      },
      destructive: {
        backgroundColor: '#ef4444',
        color: '#fff',
      },
    }

    const sizes = {
      default: {
        height: '2.5rem',
        padding: '0.5rem 1rem',
      },
      sm: {
        height: '2rem',
        padding: '0.25rem 0.75rem',
        fontSize: '0.75rem',
      },
      lg: {
        height: '3rem',
        padding: '0.75rem 2rem',
      },
    }

    return (
      <button
        ref={ref}
        style={{
          ...baseStyles,
          ...variants[variant],
          ...sizes[size],
          ...props.style,
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
