import * as React from 'react'

const Input = React.forwardRef(({ type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      style={{
        display: 'flex',
        height: '2.5rem',
        width: '100%',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#1877f2'
        e.target.style.boxShadow = '0 0 0 3px rgba(24, 119, 242, 0.1)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e5e7eb'
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
