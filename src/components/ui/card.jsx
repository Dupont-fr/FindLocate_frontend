import * as React from 'react'

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      ...props.style,
    }}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      padding: '1.5rem',
      ...props.style,
    }}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={className}
    style={{
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1',
      ...props.style,
    }}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={className}
    style={{
      fontSize: '0.875rem',
      color: '#6b7280',
      ...props.style,
    }}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      padding: '1.5rem',
      paddingTop: 0,
      ...props.style,
    }}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1.5rem',
      paddingTop: 0,
      ...props.style,
    }}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
