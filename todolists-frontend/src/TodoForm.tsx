import { Form, Input, Button } from 'antd';

interface TodoFormProps {
  onTodoAdded?: (todo: string) => void;
}

export const TodoForm = ({ onTodoAdded }: TodoFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { todo: string }) => {
    form.resetFields();
    if (onTodoAdded) {
      onTodoAdded(values.todo);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="inline"
    >
      <Form.Item
        name="todo"
        rules={[{ required: true, message: 'Please enter a todo item' }]}
      >
        <Input placeholder="Enter todo item" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Todo
        </Button>
      </Form.Item>
    </Form>
  );
};
