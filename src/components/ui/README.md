# UI Components Documentation

Reusable UI components for the FE-Pharmacy application. All components follow the project's design system using Tailwind CSS, CVA (Class Variance Authority), and Radix UI primitives.

## Components

### 1. FormInput

A form-aware input component with built-in label, error handling, hints, and icon support.

**Props:**

```typescript
interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string; // Label text above input
  error?: string; // Error message (shows in red)
  hint?: string; // Helper text below input
  required?: boolean; // Shows red asterisk on label
  icon?: React.ReactNode; // Icon to show inside input
}
```

**Usage:**

```tsx
import { FormInput } from "@/components/ui/form-input";
import { Mail } from "lucide-react";

<FormInput
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
  icon={<Mail className="size-4" />}
  hint="We'll never share your email"
  error={emailError}
  onChange={(e) => setEmail(e.target.value)}
  value={email}
/>;
```

**Features:**

- Automatic label with required indicator
- Error state styling (red border and text)
- Optional hint text (shows only when no error)
- Icon support with proper positioning
- Full TypeScript support with ref forwarding
- Inherits all HTML input attributes
- Responsive and accessible

---

### 2. FormSelect

A form-aware select dropdown component with label, error handling, hint support, and icon integration.

**Props:**

```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<
  React.ComponentProps<"select">,
  "children"
> {
  label?: string; // Label text above select
  error?: string; // Error message (shows in red)
  hint?: string; // Helper text below select
  required?: boolean; // Shows red asterisk on label
  placeholder?: string; // Placeholder option text
  options: SelectOption[]; // Array of select options
  icon?: React.ReactNode; // Icon to show inside select
}
```

**Usage:**

```tsx
import { FormSelect } from "@/components/ui/form-select";
import { Package } from "lucide-react";

<FormSelect
  label="Category"
  placeholder="Select a category"
  required
  icon={<Package className="size-4" />}
  options={[
    { value: "electronics", label: "Electronics" },
    { value: "medications", label: "Medications" },
    { value: "vitamins", label: "Vitamins & Supplements" },
  ]}
  error={categoryError}
  onChange={(e) => setCategory(e.target.value)}
  value={category}
/>;
```

**Features:**

- Automatic label with required indicator
- Error state styling
- Optional hint text
- Icon support with chevron indicator
- Disabled option support
- Custom placeholder
- Full TypeScript support
- Inherits all HTML select attributes

---

### 3. LoadingSpinner

An animated loading spinner component with size and variant options.

**Props:**

```typescript
interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"; // Default: "md"
  variant?: "default" | "secondary" | "muted" | "destructive"; // Default: "default"
  text?: string; // Optional loading text
  showText?: boolean; // Show the text label
}
```

**Sizes:**

- `sm` - 16px (4 × 4)
- `md` - 24px (6 × 6) - default
- `lg` - 32px (8 × 8)
- `xl` - 40px (10 × 10)

**Variants:**

- `default` - Primary color
- `secondary` - Secondary color
- `muted` - Muted foreground color
- `destructive` - Destructive/error color

**Usage:**

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Basic spinner
<LoadingSpinner />

// With text
<LoadingSpinner size="lg" text="Loading..." showText />

// Different variant
<LoadingSpinner size="md" variant="secondary" />

// In async operation
{isLoading ? (
  <LoadingSpinner size="lg" text="Fetching data..." showText />
) : (
  <button onClick={handleFetch}>Fetch Data</button>
)}
```

**Features:**

- CSS animation (no JavaScript animation overhead)
- Four size options for flexibility
- Four color variants matching design system
- Optional loading text
- Can be used standalone or inline
- Responsive and accessible

---

### 4. ErrorBoundary

A React error boundary component for catching and displaying errors with graceful fallback UI.

**Props:**

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode; // Custom error UI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void; // Error logging callback
}
```

**Usage:**

```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary"

// With default fallback UI
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback UI
<ErrorBoundary
  fallback={(error, reset) => (
    <div className="p-4 border border-red-500 rounded bg-red-50">
      <h3 className="font-semibold">Something went wrong</h3>
      <p className="text-sm">{error.message}</p>
      <button onClick={reset} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
        Try Again
      </button>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Send to error logging service
    captureException(error, errorInfo)
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Features:**

- Catches JavaScript errors in child components
- Shows development error details in dev mode
- Clean error message in production
- Custom fallback UI support
- Error logging callback for analytics/monitoring
- Reset functionality to recover from errors
- Styled default fallback matching design system
- Full TypeScript ErrorInfo support

**Default Fallback UI:**

- Displays "Something went wrong" message
- Shows error details in development only
- Includes "Try again" button to reset
- Styled with destructive/error colors

---

## Best Practices

### FormInput & FormSelect

1. Always provide a `label` for accessibility
2. Use `required` prop to indicate mandatory fields
3. Show `error` only when validation fails
4. Use `hint` for helpful context when there's no error
5. Consider using icons for better UX
6. Proper form submission should validate before calling API

### LoadingSpinner

1. Use appropriate `size` for context (smaller in buttons, larger on pages)
2. Show `text` only when it adds value
3. Use `variant="destructive"` for error-related loading states
4. Consider container alignment when using multiple spinners

### ErrorBoundary

1. Wrap page/route components, not every component
2. Don't wrap event handlers (use try-catch instead)
3. Implement custom fallback for better UX
4. Log errors for debugging and monitoring
5. Provide reset button for user recovery

---

## Examples

See [COMPONENT_EXAMPLES.tsx](./COMPONENT_EXAMPLES.tsx) for comprehensive examples including:

- All component variations
- Complete form example with validation
- Error boundary with custom fallback
- Loading states in async operations

---

## Styling

All components use:

- **Tailwind CSS** for styling
- **CVA** (Class Variance Authority) for variant management
- **Radix UI** as primitive foundation
- **Color system** from design tokens (primary, secondary, destructive, etc.)

The components respect:

- Light and dark mode (via `dark:` prefix)
- Disabled states
- Accessibility standards (ARIA attributes, semantic HTML)
- Focus states for keyboard navigation

---

## Import Guide

```tsx
// Import components
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Import types
import { type SelectOption } from "@/components/ui/form-select";
```

---

## Accessibility

All components include:

- Proper semantic HTML
- ARIA attributes where needed
- Keyboard navigation support
- Label associations
- Error announcements
- Focus management
- Color contrast compliance

---

## Browser Support

All components support modern browsers with ES2020+ support, matching the Next.js project requirements.
