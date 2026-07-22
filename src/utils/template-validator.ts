export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateTemplateSchema(parsedJson: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!parsedJson || typeof parsedJson !== 'object') {
    return {
      valid: false,
      errors: ['Invalid JSON format. Template must be a JSON object.'],
      warnings: [],
    };
  }

  // 1. Check version
  if (!parsedJson.version) {
    errors.push('Missing required root property: "version".');
  } else if (typeof parsedJson.version !== 'string') {
    errors.push('Property "version" must be a string (e.g., "1.0").');
  }

  // 2. Check name
  if (!parsedJson.name) {
    errors.push('Missing required root property: "name".');
  } else if (typeof parsedJson.name !== 'string') {
    errors.push('Property "name" must be a string.');
  }

  // 3. Check sections array
  if (!parsedJson.sections) {
    errors.push('Missing required root property: "sections".');
  } else if (!Array.isArray(parsedJson.sections)) {
    errors.push('Property "sections" must be an array of section IDs.');
  } else {
    // Check for duplicate IDs in sections
    const seen = new Set<string>();
    for (const sectionId of parsedJson.sections) {
      if (seen.has(sectionId)) {
        errors.push(`Duplicate section ID found in sections array: "${sectionId}".`);
      }
      seen.add(sectionId);
    }
  }

  // 4. Check config object
  if (!parsedJson.config) {
    errors.push('Missing required root property: "config".');
  } else if (typeof parsedJson.config !== 'object') {
    errors.push('Property "config" must be an object containing section configurations.');
  } else if (Array.isArray(parsedJson.sections)) {
    // Check for broken sections (sections list references a section not in config, or empty config)
    for (const sectionId of parsedJson.sections) {
      // Allow custom-1, custom-2 styles or default singleton IDs
      const configKey = sectionId.startsWith('custom-') ? 'customMarkdown' : sectionId;
      if (!parsedJson.config[configKey]) {
        errors.push(`Broken section: "${sectionId}" is declared in sections but its config block "${configKey}" is missing.`);
      }
    }
  }

  // 5. Check metadata (optional but warned if missing)
  if (!parsedJson.metadata) {
    warnings.push('Metadata block is missing. Default values will be applied.');
  } else if (typeof parsedJson.metadata !== 'object') {
    errors.push('Property "metadata" must be an object.');
  } else {
    const meta = parsedJson.metadata;
    if (!meta.description) warnings.push('Metadata is missing "description".');
    if (!meta.category) warnings.push('Metadata is missing "category".');
    if (!meta.difficulty) warnings.push('Metadata is missing "difficulty".');
    if (!meta.tags || !Array.isArray(meta.tags)) warnings.push('Metadata is missing "tags" array.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
