import {
  EtaConfig,
  PartialConfig,
} from "https://deno.land/x/eta@v1.12.3/config.ts";
import {
  compile,
  configure,
  loadFile,
  render,
  getConfig,
  renderAsync,
  renderFile,
  config,
  renderFileAsync,
  parse,
} from "https://deno.land/x/eta@v1.12.3/mod.ts";
import {TemplateParams, TemplateRenderInterface} from "./render_engine.ts";

const defaultConfig = {
  views: `${Deno.cwd()}/views/`,
  cache: true,
};

class EtaRenderEngine implements TemplateRenderInterface {
  #config:PartialConfig|undefined;
  configure(config: PartialConfig): EtaRenderEngine {
    configure(config);
    this.#config = {...defaultConfig,...config};
    return this;
  }
  async renderView(path: string, params: TemplateParams): Promise<string> {
    const fullPath = this.#config?.views+path;
    const str = await Deno.readTextFile(fullPath);
    return compile(str,this.#config)(params,config)
  }
}

const engine = new EtaRenderEngine();

export default engine.configure(defaultConfig);
