// Helper function to convert backend document type to display name
export function getDisplayDocumentType(backendType: string): string {
  const typeMap: Record<string, string> = {
    'pitch_deck': 'Pitch Deck',
    'financial_statements': 'Financial Statements',
    'legal_documents': 'Legal Documents',
    'gedsi_reports': 'GEDSI Reports',
    'impact_reports': 'Impact Reports',
    'other': 'Other',
  }
  return typeMap[backendType] || backendType
}

// Convert display name to backend value
export const documentTypeMap: Record<string, string> = {
  'Pitch Deck': 'pitch_deck',
  'Financial Statements': 'financial_statements',
  'Legal Documents': 'legal_documents',
  'GEDSI Reports': 'gedsi_reports',
  'Impact Reports': 'impact_reports',
  'Other': 'other',
}

export const validDocumentTypes = [
  'pitch_deck',
  'financial_statements',
  'legal_documents',
  'gedsi_reports',
  'impact_reports',
  'other',
]

export function resolveBackendDocumentType(rawType: string): string {
  return documentTypeMap[rawType] || rawType.toLowerCase().replace(/\s+/g, '_')
}
