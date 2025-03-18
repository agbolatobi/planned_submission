import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useCreateMemory } from '../query/useMemories';
import { useQueryClient } from '@tanstack/react-query';
import { Memory } from '../typings';

const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

interface AddMemoryDialogProps {
  open: boolean;
  onClose: () => void;
  memoryLaneId: number;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  file: yup
    .mixed()
    .required('Image is required')
    .test('fileFormat', 'Unsupported file format', (value) => {
      if (!value || !(value instanceof File)) return false;
      return SUPPORTED_IMAGE_FORMATS.includes(value.type);
    })
    .test('fileSize', 'File too large', (value) => {
      if (!value|| !(value instanceof File)) return false;
      return value.size <= 5000000; // 5MB
    }),
});

interface FormValues {
  name: string;
  description: string;
  file: File | null;
}

export default function AddMemoryDialog({ open, onClose, memoryLaneId }: AddMemoryDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: createMemory, isPending } = useCreateMemory();

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    try {
      await createMemory({
        name: values.name,
        description: values.description,
        memory_lane_id: memoryLaneId,
        timestamp: new Date().toISOString(),
        file: values.file as File,
      } as Memory);

      // Invalidate and refetch memories
      await queryClient.invalidateQueries({ queryKey: ['memories', memoryLaneId] });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create memory:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Memory</DialogTitle>
      <Formik
        initialValues={{ name: '', description: '', file: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Memory Name"
                variant="outlined"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                disabled={isSubmitting || isPending}
                margin="normal"
              />
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                disabled={isSubmitting || isPending}
                margin="normal"
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="file-input"
                type="file"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  setFieldValue('file', file);
                }}
              />
              <label htmlFor="file-input">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isSubmitting || isPending}
                >
                  Upload Image
                </Button>
              </label>
              {touched.file && errors.file && (
                <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                  {errors.file}
                </Typography>
              )}
              {values.file && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Selected file: {values.file?.name}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={onClose} 
                disabled={isSubmitting || isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || isPending}
              >
                {(isSubmitting || isPending) ? (
                  <CircularProgress size={24} />
                ) : (
                  'Add Memory'
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
} 