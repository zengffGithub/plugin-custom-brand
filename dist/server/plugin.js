/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var plugin_exports = {};
__export(plugin_exports, {
  PluginCustomBrandServer: () => PluginCustomBrandServer,
  default: () => plugin_default
});
module.exports = __toCommonJS(plugin_exports);
var import_server = require("@nocobase/server");
class PluginCustomBrandServer extends import_server.Plugin {
  async load() {
    this.app.resourceManager.define({
      name: "customBrand",
      actions: {
        get: async (ctx) => {
          const repo = this.app.db.getRepository("applicationPlugins");
          const plugin = await repo.findOne({
            filter: { packageName: "@nocobase/plugin-custom-brand" }
          });
          ctx.body = (plugin == null ? void 0 : plugin.get("options")) || {};
        },
        save: async (ctx) => {
          const values = ctx.action.params.values || {};
          await this.app.db.getRepository("applicationPlugins").update({
            filter: { packageName: "@nocobase/plugin-custom-brand" },
            values: { options: values }
          });
          ctx.body = values;
        }
      }
    });
    this.app.acl.registerSnippet({
      name: "pm.custom-brand.configuration",
      actions: ["customBrand:get", "customBrand:save"]
    });
    this.app.acl.allow("customBrand", ["get", "save"], "loggedIn");
  }
}
var plugin_default = PluginCustomBrandServer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginCustomBrandServer
});
