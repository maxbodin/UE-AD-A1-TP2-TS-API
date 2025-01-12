import { Button, Form, Input } from "antd";

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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <Form
        form={ form }
        onFinish={ handleSubmit }
        layout="inline"
        className="flex flex-col md:flex-row gap-4"
      >
        <Form.Item
          name="listName"
          rules={ [{ required: true, message: "Please enter a list name" }] }
          className="flex-1"
        >
          <Input
            placeholder="Enter list name"
            className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        <Form.Item className="self-center md:self-start">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-4 py-2"
          >
            Create List
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
