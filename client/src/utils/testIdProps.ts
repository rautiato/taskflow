import type { HTMLAttributes } from 'react'

/**
 * Adds a test ID to an inner part of an MUI component, through `slotProps`.
 *
 * On a component itself, write the attribute directly:
 *   <Button data-testid="login-form-submit">
 *
 * Inside `slotProps`, use this helper instead:
 *   <Checkbox slotProps={{ input: testIdProps('login-form-remember-me') }} />
 *
 * Writing `{ 'data-testid': '...' }` directly inside `slotProps` fails to
 * compile for some parts, such as a Checkbox's input or a field's helper text.
 * An object returned from a function doesn't have that problem. The return
 * type also lists the standard HTML attributes, so parts typed as plain HTML
 * attributes (a select's clickable box, for example) accept it too.
 */
export const testIdProps = (
  id: string,
): { 'data-testid': string } & HTMLAttributes<HTMLElement> => ({
  'data-testid': id,
})
