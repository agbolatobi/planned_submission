import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useCreateMemoryLane } from '../query/useMemoryLane';
import { useUser } from '../context/UserContext';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';

interface CreateMemoryLaneDialogProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
});

interface FormValues {
  name: string;
}

export default function CreateMemoryLaneDialog({ open, onClose }: CreateMemoryLaneDialogProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync: createMemoryLane, isPending } = useCreateMemoryLane();

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    try {
      await createMemoryLane({
        name: values.name,
        user_id: user?.id || 0,
      });
      
      // Invalidate and refetch memory lanes
      await queryClient.invalidateQueries({ queryKey: ['memoryLanes'] });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create memory lane:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Memory Lane</DialogTitle>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Memory Lane Name"
                variant="outlined"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                disabled={isSubmitting || isPending}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting || isPending}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || isPending}
              >
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
} 