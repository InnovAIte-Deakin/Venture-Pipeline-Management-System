import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { VentureIntakeFormData } from '../../schemas/venture-intake-schema'

export interface VentureIntakeStepProps {
  register: UseFormRegister<VentureIntakeFormData>
  setValue: UseFormSetValue<VentureIntakeFormData>
  watchedValues: VentureIntakeFormData
  errors: FieldErrors<VentureIntakeFormData>
}
