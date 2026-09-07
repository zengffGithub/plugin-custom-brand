import { Plugin } from '@nocobase/server';

export class PluginCustomBrandServer extends Plugin {
  async load() {
    this.app.resourceManager.define({
      name: 'customBrand',
      actions: {
        get: async (ctx) => {
          const repo = this.app.db.getRepository('applicationPlugins');
          const plugin = await repo.findOne({
            filter: { packageName: '@nocobase/plugin-custom-brand' },
          });
          ctx.body = plugin?.get('options') || {};
        },
        save: async (ctx) => {
          const values = ctx.action.params.values || {};
          await this.app.db.getRepository('applicationPlugins').update({
            filter: { packageName: '@nocobase/plugin-custom-brand' },
            values: { options: values },
          });
          ctx.body = values;
        },
      },
    });

    this.app.acl.registerSnippet({
      name: 'pm.custom-brand.configuration',
      actions: ['customBrand:get', 'customBrand:save'],
    });
    this.app.acl.allow('customBrand', ['get', 'save'], 'loggedIn');
  }
}

export default PluginCustomBrandServer;
