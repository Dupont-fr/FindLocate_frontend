import * as React from 'react'

const Badge = React.forwardRef(({ variant = 'default', ...props }, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '0.125rem 0.625rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  }

  const variants = {
    default: {
      backgroundColor: '#1877f2',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    destructive: {
      backgroundColor: '#ef4444',
      color: '#fff',
    },
    outline: {
      border: '1px solid #d1d5db',
      backgroundColor: 'transparent',
      color: '#374151',
    },
  }

  return (
    <div
      ref={ref}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...props.style,
      }}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
