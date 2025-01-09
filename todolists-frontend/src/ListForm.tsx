import { Form, Input, Button } from 'antd';
import { useState } from 'react';

interface ListFormProps {
  onListAdded?: (listName: string) => void;
}

export const ListForm = ({ onListAdded }: ListFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { listName: string }) => {
    form.resetFields();
    if (onListAdded) {
      onListAdded(values.listName);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="inline"
    >
      <Form.Item
        name="listName"
        rules={[{ required: true, message: 'Please enter a list name' }]}
      >
        <Input placeholder="Enter list name" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create List
        </Button>
      </Form.Item>
    </Form>
  );
};
