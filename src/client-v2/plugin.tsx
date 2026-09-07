import { Plugin } from '@nocobase/client-v2';

import { CustomBrandSettingsV2 } from './CustomBrandSettingsV2';

export class PluginCustomBrandClientV2 extends Plugin {
  async load() {
    this.app.pluginSettingsManager.addMenuItem({
      key: 'custom-brand',
      title: this.t('自定义品牌') as unknown as string,
      icon: 'TagOutlined',
      aclSnippet: 'pm.custom-brand.configuration',
    });

    this.app.pluginSettingsManager.addPageTabItem({
      menuKey: 'custom-brand',
      key: 'index',
      title: this.t('自定义品牌') as unknown as string,
      componentLoader: () => import('./CustomBrandSettingsV2'),
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

export default PluginCustomBrandClientV2;
