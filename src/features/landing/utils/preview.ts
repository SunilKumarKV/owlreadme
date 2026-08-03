export function formatFileName(fileName?: string): string {
  if (!fileName || fileName.trim() === '') {
    return 'owlreadme-output.md';
  }
  return fileName.trim();
}
