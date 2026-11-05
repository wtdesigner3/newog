import { Input } from '../ui/input';

export default function FormField({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5 mb-5">
      <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {hint && <div className="text-[13px] text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function ImageField({ label, required, value, onChange, hint }) {
  return (
    <div className="space-y-1.5 mb-5">
      <label className="text-sm font-semibold text-foreground/80">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input type="file" accept="image/*" onChange={onChange} className="cursor-pointer" />
      {value && (
        <img src={value} alt="preview" className="mt-2 h-20 rounded-md object-cover border border-border" />
      )}
      {hint && <div className="text-[13px] text-muted-foreground">{hint}</div>}
    </div>
  )
}

export function StatusField({ value, onChange }) {
  return (
    <div className="space-y-1.5 mb-5">
      <label className="text-sm font-semibold text-foreground/80">Status</label>
      <select 
        className="flex h-11 w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        value={value} 
        onChange={e => onChange(e.target.value)}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}

export function SortField({ value, onChange }) {
  return (
    <div className="space-y-1.5 mb-5">
      <label className="text-sm font-semibold text-foreground/80">Sort Order</label>
      <Input type="number" min="1" value={value} onChange={e => onChange(e.target.value)} placeholder="e.g. 1" />
      <div className="text-[13px] text-muted-foreground">Lower number = displayed first</div>
    </div>
  )
}
