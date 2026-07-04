export interface READMEComponentMetadata {
  id: string;
  name: string;
  category: string;
  icon: string; // Lucide icon name
  description: string;
  author: string;
  version: string;
  previewImage?: string;
  defaultEnabled?: boolean;
}

export interface READMEComponent<TConfig = any> {
  metadata: READMEComponentMetadata;
  renderer: (config: TConfig, context?: any) => string;
  validator?: (config: TConfig) => boolean;
  defaultConfig: TConfig;
}
