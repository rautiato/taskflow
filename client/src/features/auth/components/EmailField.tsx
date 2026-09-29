import type { Control, FieldValues, Path } from 'react-hook-form'
import { FormTextField } from '../../../components/FormTextField'

export function EmailField<T extends FieldValues>({
  control,
  name = 'email' as Path<T>,
  testId,
}: {
  control: Control<T>
  name?: Path<T>
  testId: string
}) {
  return (
    <FormTextField<T>
      name={name}
      control={control}
      label="Email"
      type="email"
      required
      fullWidth
      placeholder="you@example.com"
      testId={testId}
    />
  )
}
