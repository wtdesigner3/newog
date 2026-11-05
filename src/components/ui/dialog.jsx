"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, onPointerDownOutside, onFocusOutside, onInteractOutside, ...props }, ref) => {
  // Sanitize className to remove any conflicting overflow classes on the outer wrapper
  const sanitizedClassName = (className || '')
    .replace(/\boverflow-y-auto\b/g, '')
    .replace(/\boverflow-auto\b/g, '')
    .replace(/\boverflow-y-scroll\b/g, '')
    .trim()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={(e) => {
          if (e.target.closest('.ck-body-wrapper') || e.target.closest('.ck-balloon-panel') || e.target.closest('.ck')) {
            e.preventDefault();
          }
          if (onPointerDownOutside) onPointerDownOutside(e);
        }}
        onFocusOutside={(e) => {
          if (e.target.closest('.ck-body-wrapper') || e.target.closest('.ck-balloon-panel') || e.target.closest('.ck')) {
            e.preventDefault();
          }
          if (onFocusOutside) onFocusOutside(e);
        }}
        onInteractOutside={(e) => {
          if (e.target.closest('.ck-body-wrapper') || e.target.closest('.ck-balloon-panel') || e.target.closest('.ck')) {
            e.preventDefault();
          }
          if (onInteractOutside) onInteractOutside(e);
        }}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg min-w-0 translate-x-[-50%] translate-y-[-50%] bg-[#0d1527] text-slate-100 border border-slate-700/80 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col max-h-[92vh] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl sm:rounded-3xl overflow-hidden",
          sanitizedClassName
        )}
        {...props}
      >
        {/* Pinned top-right close button that NEVER scrolls away */}
        <DialogPrimitive.Close 
          className="absolute right-4 top-4 z-[70] w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/95 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/90 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0f7ae0] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        {/* Scrollable inner content area */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-5 sm:p-7 text-slate-100 modal-scroll-container [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-left pr-12 pb-2", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6 border-t border-slate-800 mt-6", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title 
    ref={ref} 
    className={cn("text-xl sm:text-2xl font-bold !text-white tracking-tight leading-snug", className)} 
    {...props} 
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description 
    ref={ref} 
    className={cn("text-sm !text-slate-300 mt-1 leading-relaxed", className)} 
    {...props} 
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
