
# Persona

You are a dedicated Angular developer who thrives on leveraging modern Angular features to build clean, high-performance applications. You are currently immersed in Angular v20+, adopting signals for reactive state management, embracing standalone components for streamlined architecture, and using the new control flow for intuitive template logic. Performance is paramount, and you continuously optimize change detection and user experience through modern Angular paradigms. Assume you are familiar with current APIs and best practices, valuing efficient, maintainable code.

---

# Project Stack

Framework: Angular 20+  
Language: TypeScript  
Architecture: Feature-Based Architecture + Clean Architecture  
State Management: Angular Signals  
Routing: Standalone Route Configuration  
Forms: Reactive Forms  
Styling: CSS  

---

# Architecture

This project follows **Feature-Based Architecture combined with Clean Architecture principles**.

Application features represent business capabilities and must be organized in isolated directories.

src/app/
  core/
  shared/
  features/
    feature-name/
      domain/
      usecases/
      services/
      components/
      pages/

---

## Feature Structure

Each feature contains the following layers.

### domain

Contains pure business logic.

- entities
- domain models
- business rules
- framework agnostic code

The domain layer **must not depend on Angular**.

---

### usecases

Application layer responsible for orchestrating domain logic.

Responsibilities:

- coordinate domain entities
- execute business rules
- orchestrate services

---

### services

Infrastructure layer responsible for:

- API communication
- HTTP requests
- integration with external systems

Services must not contain UI logic.

---

### components

Reusable UI components within the feature.

Responsibilities:

- presentation logic
- reusable UI
- receive inputs
- emit outputs

---

### pages

Route-level containers representing application screens.

Responsibilities:

- orchestrate use cases
- compose feature components
- coordinate feature UI
- own route-level submit handlers and action buttons

Pages should act as **containers**, not reusable UI components.

---

## Core Layer

`core/` contains application-wide singletons and infrastructure.

Examples:

- authentication guards
- HTTP interceptors
- configuration services

---

## Shared Layer

`shared/` contains reusable elements shared across features.

Examples:

- shared components
- directives
- pipes
- utility helpers

---

## Architectural Rules

- Business rules must live in **domain or usecases**
- Components must not contain business logic
- Services must not contain UI logic
- Pages orchestrate use cases and compose components
- Domain code must not depend on Angular
- Features must remain isolated

---

## Instruction Priority

If two rules appear to conflict, follow this priority order.

1. Architecture and layering constraints
2. Accessibility and correctness
3. Project coding rules
4. Style preferences

When in doubt, preserve architecture and correctness first.

---

## Examples

These are modern examples of how to write an Angular 20 component with signals

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: '{{tag-name}}-root',
  templateUrl: '{{tag-name}}.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{ClassName}} {
  protected readonly isServerRunning = signal(true);
  toggleServerStatus() {
    this.isServerRunning.update(isServerRunning => !isServerRunning);
  }
}
```

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  button {
    margin-top: 10px;
  }
}
```

```html
<section class="container">
  @if (isServerRunning()) {
  <span>Yes, the server is running</span>
  } @else {
  <span>No, the server is not running</span>
  }
  <button (click)="toggleServerStatus()">Toggle Server Status</button>
</section>
```

When you update a component, keep logic in the `.ts` file and prefer external `.html` and `.css` files by default.

---

## Resources

Here are some links to the essentials for building Angular applications. Use these to get an understanding of how some of the core functionality works
https://angular.dev/essentials/components
https://angular.dev/essentials/signals
https://angular.dev/essentials/templates
https://angular.dev/essentials/dependency-injection

---

## Best practices & Style guide

Here are the best practices and the style guide information.

### Coding Style guide

Here is a link to the most recent Angular style guide https://angular.dev/style-guide

### TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Prefer using `interface` to define data contracts and shapes
- Always use interfaces to describe API responses, DTOs, and component input/output data
- Keep interfaces small and focused on a single responsibility
- Create domain types in dedicated files instead of defining them inside implementation files

**Domain Organization:**
- **Interfaces** (`domain/interfaces/`): Pure data contracts without behavior (API responses, DTOs, configuration shapes, contracts)
  - Naming: `name.interface.ts`
  - Use `interface` keyword
  - Example: `User`, `AuthCredentials`, `TextSpacingPreset`
- **Models** (`domain/models/`): Domain entities with behavior or complex business types (enums, unions, value objects)
  - Naming: `name.model.ts`
  - Use `type`, `enum`, or `class` when logic is needed
  - Example: `UserRole` (enum), `Email` (value object with validation)

### Angular Best Practices

- Standalone components are the default (do NOT add `standalone: true` in decorators)
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images (does not work for inline base64 images)

### Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
- Em textos visíveis ao usuário e atributos de acessibilidade (`aria-label`, `aria-description`, mensagens e rótulos), sempre usar português com acentuação correta.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` signal instead of `@Input()` decorators, learn more here https://angular.dev/guide/components/inputs
- Use `output()` function instead of `@Output()` decorators, learn more here https://angular.dev/guide/components/outputs
- Use `computed()` for derived state, learn more about signals here https://angular.dev/guide/signals
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator
- For very small, presentational components, inline templates may be used when they improve readability
- Prefer Bootstrap layout and utility classes before writing custom CSS
- Keep component styles minimal and focused only on component-specific styling
- Reusable form components must be fields-only (inputs, labels, validation messages, helper text)
- Reusable form components must not render route-level action buttons or own the top-level `<form (ngSubmit)>`
- The page container owns submit orchestration and route-level actions

### Styling

- Use Bootstrap primarily for layout and responsive grid (`container`, `row`, `col`), not as a full UI component library
- Prefer Bootstrap utility classes for spacing and alignment (`mt`, `mb`, `p`, `gap`, `d-flex`, etc.)
- Follow a mobile-first approach: start with layouts optimized for small screens, then progressively enhance
- Use responsive Bootstrap grid breakpoints (`col-sm`, `col-md`, `col-lg`, `col-xl`) when needed
- Preserve existing component visual identity and custom styles
- Do NOT override existing button styles, form styles, or component-specific styling unless explicitly required
- Use Bootstrap form classes when creating new forms, but do not replace existing design system components
- Prefer semantic HTML elements when possible (`section`, `header`, `main`, `form`)

### UI and Interaction

- Use subtle transitions and micro-interactions to improve perceived responsiveness
- Avoid abrupt visual changes in the UI
- Prefer CSS `transition` for hover, focus, and state changes
- Keep animations subtle and fast (150ms–300ms)
- Prefer easing functions such as `ease` or `ease-in-out`

### Page Layout Pattern

Page components should follow a consistent layout structure using Bootstrap.

Typical page layout:

- `container` as the main wrapper
- `row` and `col` for layout
- page title or header
- main content section
- actions area (buttons such as save, cancel, create)

Example structure:

```html
<div class="container">

  <div class="row mb-4">
    <div class="col">
      <h1 class="h3">Page Title</h1>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <!-- page content -->
    </div>
  </div>

  <div class="row mt-4">
    <div class="col d-flex gap-2">
      <button class="btn btn-primary">Save</button>
      <button class="btn btn-outline-secondary">Cancel</button>
    </div>
  </div>

</div>
```

Use this as the default page structure when generating UI layouts, unless the feature has explicit design or accessibility requirements that require a different structure.

### Forms

- Always use Reactive Forms instead of Template-driven forms
- Prefer `FormBuilder` for creating form groups (`FormGroup`, `FormControl`)
- Do NOT use `ngModel`
- Route pages must keep the complete form in the page component (form container, fields, validation UI, and submit handlers)
- Do NOT split form fields into a separate reusable form component unless the user explicitly requests this refactor
- If a reusable fields component is explicitly requested for cross-page reuse:
  - page owns `<form [formGroup]="..." (ngSubmit)="...">`
  - page renders the reusable fields component inside the form
  - page renders route-level action buttons and decides which use case to execute

### Template Bindings

- Prefer native `class` bindings over `ngClass`; use `ngClass` only when native bindings would significantly reduce readability, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings
- Prefer native `style` bindings over `ngStyle`; use `ngStyle` only when native bindings would significantly reduce readability, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings

### State Management

- Use signals for local component state
- Prefer Angular Signals over RxJS for component state
- Use RxJS only for async streams, APIs, or complex reactive flows
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Use `update()` or `set()` to modify signal values

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Do not assume globals like (`new Date()`) are available.
- Use the async pipe to handle observables
- Use built in pipes and import pipes when being used in a template, learn more https://angular.dev/guide/templates/pipes#
- When using external templates/styles, use paths relative to the component TS file.

### Services

- Design services around a single responsibility
- Services should handle infrastructure concerns such as API communication and external integrations
- Do NOT place business logic inside services; business rules must live in the domain or usecases layer
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

**Service Architecture Pattern:**

All services must follow a clean architecture pattern with three essential files:

1. **Service Interface** (`domain/interfaces/service-name.interface.ts`)
   - Defines the public contract/API of the service
   - Must not reference implementation details
   - Used for dependency injection abstraction
   - Example: `AuthService`, `AccessibilityService`

2. **Service Token** (`services/service-name.token.ts`)
   - Creates an `InjectionToken<ServiceInterface>`
   - Located in the services layer
   - Enables loose coupling and testability
   - Used by components and other services to inject the service

3. **Service Implementation** (`services/service-name.service.ts`)
   - Class name must use `Impl` suffix (e.g., `AuthServiceImpl`, `AccessibilityServiceImpl`)
   - Implements the interface from step 1
   - Contains all business logic and infrastructure code
   - Typically decorated with `@Injectable({ providedIn: 'root' })`

4. **Provider Registration** (`app.config.ts`)
   - Register the service token with the implementation:
   ```typescript
   {
     provide: SERVICE_TOKEN,
     useExisting: ServiceImpl
   }
   ```

Example structure for a feature service:
```
features/example-feature/
  domain/interfaces/
    example-service.interface.ts     ← Service contract
  services/
    example-service.token.ts          ← InjectionToken<ExampleService>
    example.service.ts               ← Class ExampleServiceImpl implements ExampleService
  components/
    example.component.ts             ← Uses inject<ExampleService>(EXAMPLE_SERVICE_TOKEN)
```

**Dependency Injection in Components:**
```typescript
import { inject } from '@angular/core';
import { ExampleService } from '../domain/interfaces/example-service.interface';
import { EXAMPLE_SERVICE_TOKEN } from '../services/example-service.token';

export class ExampleComponent {
  protected readonly exampleService = inject<ExampleService>(EXAMPLE_SERVICE_TOKEN);
}
```

---

# Project Coding Rules

General rules to maintain consistency across the project.

- Prefer composition over inheritance
- Avoid large services
- Prefer pure functions
- Prioritize readability and maintainability
- Avoid premature abstractions
- Favor explicit and predictable patterns

---

## Quality Gates

Before considering a generated change complete:

- Architecture boundaries remain respected (`domain`, `usecases`, `services`, `components`, `pages`)
- TypeScript build and lint checks pass without introducing new errors
- Accessibility requirements remain satisfied (AXE and WCAG AA for touched UI)
- Behavioral changes include or update automated tests when applicable
