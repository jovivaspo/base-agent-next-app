
---
name: shadcn/ui
description: Complete guide con contexto de uso
license: MIT
metadata:
  author: next-agent-template
  version: "1.0"
  scope: [root, ui, components]
  auto_invoke: 
  - "Adding shadcn components"
  - "Working with shadcn/ui"
  - "Creating shadcn components"
  - "Styling components with Tailwind"
  - "Setting up component themes"
  - "Composing UI layouts"
  - "Fixing component styling"
  - "Customizing component variants"
  - "shadcn init"
  - "create an app with --preset"
  - "switch to --preset"
---

# shadcn/ui Skill Summary | Resumen de la Skill shadcn/ui

---

## 📌 Overview | Descripción General

**shadcn/ui** is a framework for building UI components and design systems. Components are added as source code to your project via CLI.

**shadcn/ui** es un framework para construir componentes UI y sistemas de diseño. Los componentes se añaden como código fuente a tu proyecto mediante CLI.

---

## 🎯 Key Principles | Principios Clave

### Use existing components first | Usa componentes existentes primero
- Check registries before writing custom UI
- Revisa los registros antes de escribir UI custom

### Compose, don't reinvent | Componer, no reinventar
- Settings page = Tabs + Card + form controls
- Dashboard = Sidebar + Card + Chart + Table

### Use built-in variants before custom styles | Usa variantes built-in antes de estilos custom
- `variant="outline"`, `size="sm"`, etc.

### Use semantic colors | Usa colores semánticos
- `bg-primary`, `text-muted-foreground` — never raw values
- Nunca valores raw como `bg-blue-500`

---

## ⚙️ Critical Rules | Reglas Críticas

### Styling & Tailwind

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `space-y-4` | `flex flex-col gap-4` |
| `space-x-4` | `flex gap-4` |
| `w-10 h-10` | `size-10` |
| `overflow-hidden text-ellipsis whitespace-nowrap` | `truncate` |
| Manual `dark:` overrides | Semantic tokens (`bg-background`) |

### Forms & Inputs | Formularios e Inputs

```tsx
// ✅ Correct way
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// ❌ Never use raw div with space-y-*
<div className="space-y-4">
  <label>Email</label>
  <input />
</div>
```

**Validation | Validación:**
- `data-invalid` on `Field`
- `aria-invalid` on the control

```tsx
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>
```

### Component Structure | Estructura de Componentes

- Items always inside their Group: `SelectItem` → `SelectGroup`
- Dialog, Sheet, Drawer need `Title` (accessibility)
- Full Card composition: `CardHeader` / `CardTitle` / `CardContent` / `CardFooter`
- `Avatar` always needs `AvatarFallback`
- `TabsTrigger` must be inside `TabsList`

### Icons

```tsx
// ✅ Correct: data-icon on icon, no sizing classes
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// ❌ Wrong: sizing classes on icon
<Button>
  <SearchIcon className="w-4 h-4" />
  Search
</Button>
```

---

## 🧩 Common Components Selection | Selección de Componentes Comunes

| Need | Use | Necesidad | Usar |
|------|-----|-----------|------|
| Button/action | `Button` | Botón/acción | `Button` |
| Form inputs | `Input`, `Select`, `Checkbox`, `Textarea` | Inputs de formulario | `Input`, `Select`, `Checkbox`, `Textarea` |
| Toggle 2–5 options | `ToggleGroup` | Toggle 2-5 opciones | `ToggleGroup` |
| Data display | `Table`, `Card`, `Badge`, `Avatar` | Mostrar datos | `Table`, `Card`, `Badge`, `Avatar` |
| Navigation | `Sidebar`, `Tabs`, `Pagination`, `Breadcrumb` | Navegación | `Sidebar`, `Tabs`, `Pagination`, `Breadcrumb` |
| Overlays | `Dialog` (modal), `Sheet`, `Drawer`, `AlertDialog` | Overlays | `Dialog` (modal), `Sheet`, `Drawer`, `AlertDialog` |
| Feedback | `sonner` (toast), `Alert`, `Progress`, `Skeleton` | Feedback | `sonner` (toast), `Alert`, `Progress`, `Skeleton` |
| Charts | `Chart` (wraps Recharts) | Gráficos | `Chart` (wraps Recharts) |
| Empty states | `Empty` | Estados vacíos | `Empty` |
| Menus | `DropdownMenu`, `ContextMenu`, `Menubar` | Menús | `DropdownMenu`, `ContextMenu`, `Menubar` |

---

## 🔧 Workflow | Flujo de Trabajo

### Step 1: Get Project Context | Paso 1: Obtén el Contexto del Proyecto
```bash
npx shadcn@latest info --json
```
Gets: aliases, isRSC, tailwindVersion, base, iconLibrary, packageManager, etc.

### Step 2: Check Installed Components | Paso 2: Verifica Componentes Instalados
Before running `add`, check if the component already exists.

### Step 3: Search Registries | Paso 3: Busca en Registros
```bash
npx shadcn@latest search @shadcn -q "sidebar"
```

### Step 4: Get Docs & Examples | Paso 4: Obtén Documentación
```bash
npx shadcn@latest docs button dialog select
```

### Step 5: Install or Update | Paso 5: Instala o Actualiza
```bash
npx shadcn@latest add button card dialog
```

### Step 6: Preview Changes | Paso 6: Vista Previa de Cambios
```bash
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
```

### Step 7: Review & Fix Imports | Paso 7: Revisa e Importa
After adding components from community registries, check for hardcoded paths and replace with correct aliases.

---

## 🎨 Customization & Theming | Personalización y Temas

### How It Works | Cómo Funciona
1. CSS variables defined in `:root` (light) and `.dark` (dark mode)
2. Tailwind maps them to utilities: `bg-primary`, `text-muted-foreground`
3. Components use these utilities — change a variable = change all components

### Color Variables | Variables de Color

| Variable | Purpose | Propósito |
|----------|---------|-----------|
| `--background` / `--foreground` | Page background and text | Fondo de página y texto |
| `--primary` / `--primary-foreground` | Primary buttons and actions | Botones primarios |
| `--secondary` / `--secondary-foreground` | Secondary actions | Acciones secundarias |
| `--muted` / `--muted-foreground` | Muted/disabled states | Estados mutados/deshabilitados |
| `--accent` / `--accent-foreground` | Hover and accent | Estados de hover |
| `--destructive` / `--destructive-foreground` | Error and destructive | Errores y acciones destructivas |
| `--border` | Default border color | Color de borde por defecto |

Colors use **OKLCH format**: `--primary: oklch(0.205 0 0)`

### Change Theme | Cambiar Tema
```bash
# Apply a preset code
npx shadcn@latest init --preset a2r6bw --force

# Switch to named preset
npx shadcn@latest init --preset radix-nova --force
```

### Add Custom Colors | Añadir Colores Custom
Edit the global CSS file (typically `globals.css`):

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
```

Then register with Tailwind:

```css
/* Tailwind v4 */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Use in components:
```tsx
<div className="bg-warning text-warning-foreground">Warning</div>
```

---

## 📦 Quick Reference | Referencia Rápida

### Create Projects | Crear Proyectos
```bash
# New project with preset
npx shadcn@latest init --name my-app --preset base-nova

# New project with specific template
npx shadcn@latest init --name my-app --preset a2r6bw --template vite

# Initialize existing project
npx shadcn@latest init --preset base-nova
```

### Add Components | Añadir Componentes
```bash
npx shadcn@latest add button card dialog
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add --all
```

### Preview & Docs | Vista Previa y Documentación
```bash
npx shadcn@latest add button --dry-run
npx shadcn@latest docs button dialog select
npx shadcn@latest view @shadcn/button
```

### Search | Buscar
```bash
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest search @tailark -q "stats"
```

---

## 📝 Important Notes | Notas Importantes

✅ **Always use the project's package runner:**
- `npx shadcn@latest` for npm
- `pnpm dlx shadcn@latest` for pnpm
- `bunx --bun shadcn@latest` for bun

✅ **Check `isRSC` field:** If true, components with `useState`, `useEffect`, or event handlers need `"use client"` directive

✅ **Never manually decode preset codes** — pass them directly to `npx shadcn@latest init --preset <code>`

✅ **Use `cn()` for conditional classes** instead of template literal ternaries

✅ **Never override component colors** — use semantic tokens instead

---

## 🚀 Customization Priorities | Prioridades de Personalización

1. **Built-in variants** — `<Button variant="outline" size="sm">`
2. **Tailwind classes** — `<Card className="max-w-md mx-auto">`
3. **Add new variants** — Edit component source to add via `cva`
4. **Wrapper components** — Compose shadcn/ui primitives into higher-level components

---
