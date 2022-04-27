export interface TemplateRenderInterface {
  renderView(path: string, params: TemplateParams): Promise<string>;
  configure(config: {}): TemplateRenderInterface;
}

export type TemplateParams = {[key: string]: TemplateParams};

export class RenderEngineFactory {}
