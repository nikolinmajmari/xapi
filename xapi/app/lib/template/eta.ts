import {
  EtaConfig,
  PartialConfig,
} from "https://deno.land/x/eta@v1.12.3/config.ts";
import {
  compile,
  configure,
  loadFile,
  render,
  renderAsync,
  renderFile,
  renderFileAsync,
  parse,
} from "https://deno.land/x/eta@v1.12.3/mod.ts";
import {TemplateParams, TemplateRenderInterface} from "./render_engine.ts";

const defaultConfig = {
  views: `${Deno.cwd()}/views/`,
  cache: true,
};

class EtaRenderEngine implements TemplateRenderInterface {
  configure(config: PartialConfig = defaultConfig): EtaRenderEngine {
    configure(config);
    return this;
  }
  async renderView(path: string, params: TemplateParams): Promise<string> {
    return (await renderFile(path, params)) ?? "";
  }
}

const engine = new EtaRenderEngine();

export default engine.configure();
