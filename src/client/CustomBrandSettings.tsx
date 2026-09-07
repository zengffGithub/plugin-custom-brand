import { useAPIClient } from '@nocobase/client';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

interface BrandConfig {
  brand?: string;
}

export const CustomBrandSettings: React.FC = () => {
  const [form] = Form.useForm();
  const api = useAPIClient();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .request({ url: 'customBrand:get', method: 'get' })
      .then((res: any) => {
        const config: BrandConfig = res?.data?.data || {};
        form.setFieldsValue({ brand: config.brand || '' });
      })
      .catch(() => {});
  }, [api, form]);

  const handleSave = async (values: BrandConfig) => {
    setLoading(true);
    try {
      const data: BrandConfig = { brand: values.brand || '' };
      await api.request({ url: 'customBrand:save', method: 'post', data });
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

export default CustomBrandSettings;
