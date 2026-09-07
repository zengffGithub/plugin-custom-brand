import { useApp } from '@nocobase/client-v2';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

interface BrandConfig {
  brand?: string;
}

export const CustomBrandSettingsV2: React.FC = () => {
  const [form] = Form.useForm();
  const app = useApp();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    app.apiClient
      .request({ url: 'customBrand:get', method: 'get' })
      .then((res: any) => {
        const config: BrandConfig = res?.data?.data || {};
        form.setFieldsValue({ brand: config.brand || '' });
      })
      .catch(() => {});
  }, [app, form]);

  const handleSave = async (values: BrandConfig) => {
    setLoading(true);
    try {
      // 仅保存 brand，不保存 about
      const data: BrandConfig = { brand: values.brand || '' };
      await app.apiClient.request({ url: 'customBrand:save', method: 'post', data });
      message.success('保存成功，刷新页面后生效');
      setTimeout(() => window.location.reload(), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false}>
      <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ brand: '' }}>
        <Form.Item
          name="brand"
          label="登录页底部品牌（HTML）"
          help={
            <Text type="secondary">
              默认为空——不显示任何品牌信息。填写后显示在登录页底部，支持 {'{{appVersion}}'} 占位符自动替换为版本号。
              <br />
              示例：
              <code style={{ display: 'block', marginTop: 4, padding: 4, background: '#f5f5f5' }}>
                {'Powered by <span style="font-weight:600">Digit</span> {{appVersion}}'}
              </code>
            </Text>
          }
        >
          <Input.TextArea
            rows={3}
            placeholder={'Powered by <span style="font-weight:600">Digit</span> {{appVersion}}'}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CustomBrandSettingsV2;
