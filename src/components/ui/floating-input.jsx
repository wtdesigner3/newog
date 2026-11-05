"use client"
import * as React from "react"
import { cn } from "../../lib/utils"

const FloatingInput = React.forwardRef(({ className, type, label, id, rightElement, ...props }, ref) => {
  const inputId = id || React.useId()
  return (
    <div className="relative">
      <input
        type={type}
        id={inputId}
        className={cn(
          "block px-4 pb-2.5 pt-6 w-full text-sm text-foreground bg-muted/40 rounded-lg border border-border appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary peer transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder=" "
        ref={ref}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="absolute text-[13px] text-muted-foreground duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-medium cursor-text peer-focus:font-semibold"
      >
        {label}
      </label>
      {rightElement && (
        <div className="absolute right-3 top-2 z-20 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  )
})
FloatingInput.displayName = "FloatingInput"

const FloatingSelect = React.forwardRef(({ className, label, id, children, ...props }, ref) => {
  const selectId = id || React.useId()
  return (
    <div className="relative">
      <select
        id={selectId}
        className={cn(
          "block px-4 pb-2.5 pt-6 w-full text-sm text-foreground bg-muted/40 rounded-lg border border-border appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary peer transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <label
        htmlFor={selectId}
        className="absolute text-[13px] text-muted-foreground duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 text-primary font-semibold"
      >
        {label}
      </label>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  )
})
FloatingSelect.displayName = "FloatingSelect"

const FloatingTextarea = React.forwardRef(({ className, label, id, rightElement, ...props }, ref) => {
  const textareaId = id || React.useId()
  return (
    <div className="relative">
      <textarea
        id={textareaId}
        className={cn(
          "block px-4 pb-2.5 pt-6 w-full text-sm text-foreground bg-muted/40 rounded-lg border border-border appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary peer transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        placeholder=" "
        ref={ref}
        {...props}
      />
      <label
        htmlFor={textareaId}
        className="absolute text-[13px] text-muted-foreground duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-medium cursor-text peer-focus:font-semibold pr-1"
      >
        {label}
      </label>
      {rightElement && (
        <div className="absolute right-3 top-2 z-20 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  )
})
FloatingTextarea.displayName = "FloatingTextarea"

export { FloatingInput, FloatingSelect, FloatingTextarea }
