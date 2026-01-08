/**
 * Example usage of the useForm hook
 * This file demonstrates various use cases for the dynamic form hook
 */

import { z } from "zod";
import useForm from "./useForm";
import { Box, Button, TextField, Alert, CircularProgress } from "@mui/material";

// ============================================================================
// Example 1: Basic Contact Form
// ============================================================================

// Define the schema with Zod
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

// Infer TypeScript type from schema
type ContactFormData = z.infer<typeof contactSchema>;

export function ContactFormExample() {
    const form = useForm<ContactFormData>({
        schema: contactSchema,
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
        onSubmit: async (data) => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form submitted:", data);
            alert(`Thank you, ${data.name}! We'll be in touch.`);
        },
        onError: (errors) => {
            console.log("Validation errors:", errors);
        },
        resetOnSuccess: true,
        debug: true,
    });

    return (
        <Box component="form" onSubmit={form.handleSubmit} sx={{ maxWidth: 400 }}>
            {form.submissionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {form.submissionError}
                </Alert>
            )}

            <TextField
                {...form.getFieldProps("name")}
                label="Name"
                fullWidth
                margin="normal"
            />

            <TextField
                {...form.getFieldProps("email")}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
            />

            <TextField
                {...form.getFieldProps("message")}
                label="Message"
                multiline
                rows={4}
                fullWidth
                margin="normal"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={form.isSubmitting}
                    startIcon={form.isSubmitting && <CircularProgress size={20} />}
                >
                    {form.isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <Button
                    type="button"
                    variant="outlined"
                    onClick={form.resetForm}
                    disabled={form.isSubmitting}
                >
                    Reset
                </Button>
            </Box>
        </Box>
    );
}

// ============================================================================
// Example 2: Login Form with Custom Validation
// ============================================================================

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginFormExample() {
    const form = useForm<LoginFormData>({
        schema: loginSchema,
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: async (data) => {
            // Simulate API login
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (data.email === "test@test.com") {
                        reject(new Error("Invalid credentials"));
                    } else {
                        resolve(data);
                    }
                }, 1000);
            });
            console.log("Login successful:", data);
        },
    });

    return (
        <Box component="form" onSubmit={form.handleSubmit} sx={{ maxWidth: 350 }}>
            {form.submissionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {form.submissionError}
                </Alert>
            )}

            <TextField
                {...form.getFieldProps("email")}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                autoComplete="email"
            />

            <TextField
                {...form.getFieldProps("password")}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                autoComplete="current-password"
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={form.isSubmitting}
                sx={{ mt: 2 }}
            >
                {form.isSubmitting ? "Logging in..." : "Login"}
            </Button>
        </Box>
    );
}

// ============================================================================
// Example 3: Multi-Step Registration Form
// ============================================================================

const registrationSchema = z.object({
    // Step 1: Account
    email: z.string().email("Invalid email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),

    // Step 2: Profile
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),

    // Step 3: Preferences
    newsletter: z.boolean().optional(),
    notifications: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationFormExample() {
    const form = useForm<RegistrationFormData>({
        schema: registrationSchema,
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phone: "",
            newsletter: true,
            notifications: true,
        },
        transformOnSubmit: (data) => {
            // Remove confirmPassword before sending to API
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword: _confirmPassword, ...submitData } = data;
            return submitData as RegistrationFormData;
        },
        onSubmit: async (data) => {
            console.log("Registration data:", data);
            // Handle registration
        },
    });

    // Example: Programmatically set values
    const fillTestData = () => {
        form.setFieldValues({
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
        });
    };

    // Example: Validate specific fields
    const validateAccountStep = async () => {
        const emailValid = await form.validateField("email");
        const passwordValid = await form.validateField("password");
        const confirmValid = await form.validateField("confirmPassword");
        return emailValid && passwordValid && confirmValid;
    };

    return (
        <Box component="form" onSubmit={form.handleSubmit}>
            {/* Form fields... */}
            <Button onClick={fillTestData}>Fill Test Data</Button>
            <Button onClick={validateAccountStep}>Validate Step 1</Button>
            <Button type="submit" disabled={form.isSubmitting}>
                Register
            </Button>
        </Box>
    );
}

// ============================================================================
// Example 4: Dynamic Form with Field Definitions
// ============================================================================

const dynamicSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    industry: z.string().min(1, "Please select an industry"),
    employees: z.string(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type DynamicFormData = z.infer<typeof dynamicSchema>;

export function DynamicFormExample() {
    const form = useForm<DynamicFormData>({
        schema: dynamicSchema,
        defaultValues: {
            company: "",
            industry: "",
            employees: "",
            website: "",
        },
        // Define fields for dynamic rendering
        fields: [
            {
                name: "company",
                label: "Company Name",
                type: "text",
                required: true,
                placeholder: "Enter your company name",
            },
            {
                name: "industry",
                label: "Industry",
                type: "select",
                required: true,
                options: [
                    { value: "tech", label: "Technology" },
                    { value: "finance", label: "Finance" },
                    { value: "healthcare", label: "Healthcare" },
                    { value: "retail", label: "Retail" },
                    { value: "other", label: "Other" },
                ],
            },
            {
                name: "employees",
                label: "Number of Employees",
                type: "select",
                options: [
                    { value: "1-10", label: "1-10" },
                    { value: "11-50", label: "11-50" },
                    { value: "51-200", label: "51-200" },
                    { value: "201-500", label: "201-500" },
                    { value: "500+", label: "500+" },
                ],
            },
            {
                name: "website",
                label: "Website",
                type: "url",
                placeholder: "https://example.com",
            },
        ],
        onSubmit: async (data) => {
            console.log("Dynamic form data:", data);
        },
    });

    // Render fields dynamically
    return (
        <Box component="form" onSubmit={form.handleSubmit}>
            {form.fields.map((field) => (
                <TextField
                    key={String(field.name)}
                    {...form.getFieldProps(field.name)}
                    label={field.label}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    fullWidth
                    margin="normal"
                    select={field.type === "select"}
                    SelectProps={field.type === "select" ? { native: true } : undefined}
                >
                    {field.type === "select" && (
                        <>
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </>
                    )}
                </TextField>
            ))}

            <Button type="submit" variant="contained">
                Submit
            </Button>
        </Box>
    );
}
