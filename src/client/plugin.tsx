import { Plugin } from '@nocobase/client';

import { CustomBrandSettings } from './CustomBrandSettings';

export class PluginCustomBrandClient extends Plugin {
  async load() {
    this.pluginSettingsManager.add('custom-brand', {
      icon: 'TagOutlined',
      title: '{{t("自定义品牌", {"ns": "@nocobase/plugin-custom-brand"})}}',
      Component: CustomBrandSettings,
      aclSnippet: 'pm.custom-brand.configuration',
    });

    const about = this.options?.options?.about;
    if (!about) {
      this.hideDefaultHelp();
    }
  }

  private hideDefaultHelp() {
    const hide = () => {
      const btn = document.querySelector('[data-testid="help-button"]');
      if (!btn) return;
      const container = btn.parentElement as HTMLElement | null;
      if (container && container.style.display !== 'none') {
        container.style.display = 'none';
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(hide);
    observer.observe(document.body, { childList: true, subtree: true });
    hide();
  }
}

export default PluginCustomBrandClient;
