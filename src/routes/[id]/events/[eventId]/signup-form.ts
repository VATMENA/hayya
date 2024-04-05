import { z } from 'zod';

export const formSchema = z.object({
    desiredPosition: z.string().min(1, {
        message: "Please select a position"
    }),
    availableFrom: z.string().min(1, {
        message: "Please specify a start time",
    }),
    availableTo: z.string().min(1, {
        message: "Please specify a start time",
    }),
    comments: z.string(),
});

export type FormSchema = typeof formSchema;