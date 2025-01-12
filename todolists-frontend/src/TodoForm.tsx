import { Button, Form, Input } from "antd";

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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      <Form
        form={ form }
        onFinish={ handleSubmit }
        layout="inline"
        className="flex flex-col md:flex-row gap-4"
      >
        <Form.Item
          name="todo"
          rules={ [{ required: true, message: "Please enter a todo item" }] }
          className="flex-1"
        >
          <Input
            placeholder="Enter todo item"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        <Form.Item className="self-center md:self-start">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2"
          >
            Add Todo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
