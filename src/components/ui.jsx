import React from 'react'

export function Button({ color = 'green', className = '', children, disabled, ...props }) {
  const colors = {
    green: 'bg-duo-green text-white shadow-[0_4px_0_0_#46a302]',
    blue: 'bg-duo-blue text-white shadow-[0_4px_0_0_#1899d6]',
    gray: 'bg-gray-200 text-gray-400 shadow-[0_4px_0_0_#d6d6d6] dark:bg-gray-700 dark:text-gray-500 dark:shadow-[0_4px_0_0_#333]',
    red: 'bg-duo-red text-white shadow-[0_4px_0_0_#d63030]',
    white: 'bg-white text-duo-blue border-2 border-gray-200 shadow-[0_4px_0_0_#e5e5e5] dark:bg-gray-800 dark:border-gray-700 dark:shadow-[0_4px_0_0_#111]',
  }
  return (
    <button
      disabled={disabled}
      className={`btn-3d px-5 py-3 text-sm md:text-base ${
        disabled ? colors.gray : colors[color]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-duo-green transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      >
        <div className="h-1 mt-1 mx-2 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

export function Pill({ icon: Icon, children, color = 'text-duo-ink' }) {
  return (
    <div className={`flex items-center gap-1 font-extrabold ${color}`}>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </div>
  )
}
