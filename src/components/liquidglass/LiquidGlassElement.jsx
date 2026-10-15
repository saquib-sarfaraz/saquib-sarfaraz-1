import React from 'react';

/**
 * LiquidGlassElement:
 * Marks an element as a target for the LiquidGlass WebGL shader.
 * Serializes custom configuration into `data-config` and sets `data-glass="true"`.
 */
export default function LiquidGlassElement({
  children,
  as: Component = 'div',
  config = null,
  className = '',
  style = {},
  ...props
}) {
  const configString = config ? JSON.stringify(config) : undefined;

  return (
    <Component
      data-glass="true"
      data-config={configString}
      className={`liquid-glass-element ${className}`}
      style={{
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
