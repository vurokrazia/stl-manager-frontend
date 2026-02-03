/**
 * Category Modal - Create/Edit category modal
 */

import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { Category } from '@/types/models';

interface CategoryModalProps {
  open: boolean;
  category: Category | null;
  isSubmitting: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  category,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (category) {
        form.setFieldsValue({ name: category.name });
      } else {
        form.resetFields();
      }
    }
  }, [open, category, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values.name);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={category ? 'Edit Category' : 'Create Category'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isSubmitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="category_form"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            { required: true, message: 'Please input the category name' },
            { min: 2, message: 'Name must be at least 2 characters' },
            { max: 50, message: 'Name must not exceed 50 characters' },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
