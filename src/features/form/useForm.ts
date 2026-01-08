import { useState, useCallback, useMemo } from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import type {
    UseFormProps,
    FieldValues,
    UseFormReturn,
    Path,
    PathValue,
    SubmitHandler,
    SubmitErrorHandler,
    DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema, ZodError } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface FormField<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "select" | "checkbox" | "radio" | "date" | "time" | "datetime-local" | "file" | "hidden";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string | number; label: string }[]; // For select/radio
    helperText?: string;
    autoComplete?: string;
    min?: number | string;
    max?: number | string;
    step?: number;
    rows?: number; // For textarea
    accept?: string; // For file input
    multiple?: boolean; // For file/select
}

export interface UseFormConfig<T extends FieldValues> {
    /** Zod schema for validation */
    schema?: ZodSchema<T>;
    /** Default values for the form */
    defaultValues?: DefaultValues<T>;
    /** Field definitions for dynamic form rendering */
    fields?: FormField<T>[];
    /** Called on successful form submission */
    onSubmit?: SubmitHandler<T>;
    /** Called when validation fails */
    onError?: SubmitErrorHandler<T>;
    /** Called when form is reset */
    onReset?: () => void;
    /** Additional react-hook-form options */
    formOptions?: Omit<UseFormProps<T>, "resolver" | "defaultValues">;
    /** Enable debug mode for logging */
    debug?: boolean;
    /** Transform values before submission */
    transformOnSubmit?: (values: T) => T | Promise<T>;
    /** Reset form after successful submission */
    resetOnSuccess?: boolean;
}

export interface UseFormResult<T extends FieldValues> {
    /** The underlying react-hook-form instance */
    form: UseFormReturn<T>;
    /** Field definitions with registered props */
    fields: FormField<T>[];
    /** Whether the form is currently submitting */
    isSubmitting: boolean;
    /** Whether the form has been submitted at least once */
    isSubmitted: boolean;
    /** Whether the form is valid */
    isValid: boolean;
    /** Whether the form has been modified */
    isDirty: boolean;
    /** Number of times form was submitted */
    submitCount: number;
    /** Handle form submission with loading state */
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    /** Reset form to default values */
    resetForm: () => void;
    /** Set a single field value */
    setFieldValue: <K extends Path<T>>(name: K, value: PathValue<T, K>) => void;
    /** Set multiple field values at once */
    setFieldValues: (values: Partial<T>) => void;
    /** Get a single field value */
    getFieldValue: <K extends Path<T>>(name: K) => PathValue<T, K>;
    /** Get all current form values */
    getAllValues: () => T;
    /** Clear all errors */
    clearAllErrors: () => void;
    /** Clear a specific field error */
    clearFieldError: (name: Path<T>) => void;
    /** Set a custom error on a field */
    setFieldError: (name: Path<T>, message: string) => void;
    /** Check if a specific field has an error */
    hasFieldError: (name: Path<T>) => boolean;
    /** Get error message for a specific field */
    getFieldError: (name: Path<T>) => string | undefined;
    /** Get all error messages as a flat array */
    getAllErrors: () => { field: string; message: string }[];
    /** Submission error (non-field error) */
    submissionError: string | null;
    /** Set submission error */
    setSubmissionError: (error: string | null) => void;
    /** Clear submission error */
    clearSubmissionError: () => void;
    /** Get props for a field to spread onto an input */
    getFieldProps: (name: Path<T>) => {
        name: Path<T>;
        error: boolean;
        helperText: string | undefined;
    };
    /** Validate the entire form without submitting */
    validateForm: () => Promise<boolean>;
    /** Validate a single field */
    validateField: (name: Path<T>) => Promise<boolean>;
    /** Register a field (from react-hook-form) */
    register: UseFormReturn<T>["register"];
    /** Watch field values */
    watch: UseFormReturn<T>["watch"];
    /** Form control for Controller components */
    control: UseFormReturn<T>["control"];
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useForm<T extends FieldValues>(
    config: UseFormConfig<T> = {}
): UseFormResult<T> {
    const {
        schema,
        defaultValues,
        fields = [],
        onSubmit,
        onError,
        onReset,
        formOptions = {},
        debug = false,
        transformOnSubmit,
        resetOnSuccess = false,
    } = config;

    // Submission error state (for API/server errors)
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // Initialize react-hook-form
    const form = useReactHookForm<T>({
        ...formOptions,
        defaultValues,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: schema ? zodResolver(schema as any) : undefined,
        mode: formOptions.mode ?? "onBlur",
        reValidateMode: formOptions.reValidateMode ?? "onChange",
    });

    const {
        register,
        handleSubmit: rhfHandleSubmit,
        reset,
        setValue,
        getValues,
        setError,
        clearErrors,
        trigger,
        formState: {
            errors,
            isSubmitting,
            isSubmitted,
            isValid,
            isDirty,
            submitCount,
        },
    } = form;

    // Debug logging
    const log = useCallback(
        (...args: unknown[]) => {
            if (debug) {
                console.log("[useForm]", ...args);
            }
        },
        [debug]
    );

    // Handle form submission
    const handleSubmit = useCallback(
        async (e?: React.BaseSyntheticEvent) => {
            e?.preventDefault();
            setSubmissionError(null);

            log("Submitting form...");

            await rhfHandleSubmit(
                async (data) => {
                    try {
                        log("Form data:", data);

                        // Transform data if transformer provided
                        const transformedData = transformOnSubmit
                            ? await transformOnSubmit(data as T)
                            : data;

                        log("Transformed data:", transformedData);

                        // Call onSubmit handler
                        if (onSubmit) {
                            await onSubmit(transformedData as T);
                        }

                        log("Submission successful");

                        // Reset form after success if configured
                        if (resetOnSuccess) {
                            reset(defaultValues);
                        }
                    } catch (error) {
                        log("Submission error:", error);

                        // Handle Zod validation errors
                        if ((error as ZodError).issues) {
                            const zodError = error as ZodError;
                            zodError.issues.forEach((issue) => {
                                const fieldName = issue.path.join(".") as Path<T>;
                                setError(fieldName, {
                                    type: "manual",
                                    message: issue.message,
                                });
                            });
                            return;
                        }

                        // Handle generic errors
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : "An unexpected error occurred";
                        setSubmissionError(errorMessage);
                    }
                },
                (fieldErrors) => {
                    log("Validation errors:", fieldErrors);
                    if (onError) {
                        onError(fieldErrors);
                    }
                }
            )(e);
        },
        [
            rhfHandleSubmit,
            onSubmit,
            onError,
            transformOnSubmit,
            resetOnSuccess,
            reset,
            defaultValues,
            setError,
            log,
        ]
    );

    // Reset form to default values
    const resetForm = useCallback(() => {
        log("Resetting form");
        reset(defaultValues);
        setSubmissionError(null);
        if (onReset) {
            onReset();
        }
    }, [reset, defaultValues, onReset, log]);

    // Set a single field value
    const setFieldValue = useCallback(
        <K extends Path<T>>(name: K, value: PathValue<T, K>) => {
            log(`Setting field "${String(name)}" to:`, value);
            setValue(name, value, { shouldValidate: true, shouldDirty: true });
        },
        [setValue, log]
    );

    // Set multiple field values at once
    const setFieldValues = useCallback(
        (values: Partial<T>) => {
            log("Setting multiple field values:", values);
            Object.entries(values).forEach(([key, value]) => {
                setValue(key as Path<T>, value as PathValue<T, Path<T>>, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            });
        },
        [setValue, log]
    );

    // Get a single field value
    const getFieldValue = useCallback(
        <K extends Path<T>>(name: K): PathValue<T, K> => {
            return getValues(name);
        },
        [getValues]
    );

    // Get all current form values
    const getAllValues = useCallback((): T => {
        return getValues();
    }, [getValues]);

    // Clear all errors
    const clearAllErrors = useCallback(() => {
        log("Clearing all errors");
        clearErrors();
        setSubmissionError(null);
    }, [clearErrors, log]);

    // Clear a specific field error
    const clearFieldError = useCallback(
        (name: Path<T>) => {
            log(`Clearing error for field "${String(name)}"`);
            clearErrors(name);
        },
        [clearErrors, log]
    );

    // Set a custom error on a field
    const setFieldError = useCallback(
        (name: Path<T>, message: string) => {
            log(`Setting error for field "${String(name)}":`, message);
            setError(name, { type: "manual", message });
        },
        [setError, log]
    );

    // Check if a specific field has an error
    const hasFieldError = useCallback(
        (name: Path<T>): boolean => {
            const keys = (name as string).split(".");
            let current: unknown = errors;
            for (const key of keys) {
                if (current && typeof current === "object" && key in current) {
                    current = (current as Record<string, unknown>)[key];
                } else {
                    return false;
                }
            }
            return !!current;
        },
        [errors]
    );

    // Get error message for a specific field
    const getFieldError = useCallback(
        (name: Path<T>): string | undefined => {
            const keys = (name as string).split(".");
            let current: unknown = errors;
            for (const key of keys) {
                if (current && typeof current === "object" && key in current) {
                    current = (current as Record<string, unknown>)[key];
                } else {
                    return undefined;
                }
            }
            if (current && typeof current === "object" && "message" in current) {
                return (current as { message?: string }).message;
            }
            return undefined;
        },
        [errors]
    );

    // Get all error messages as a flat array
    const getAllErrors = useCallback((): { field: string; message: string }[] => {
        const result: { field: string; message: string }[] = [];

        const extractErrors = (obj: unknown, prefix = "") => {
            if (!obj || typeof obj !== "object") return;

            Object.entries(obj).forEach(([key, value]) => {
                const fieldPath = prefix ? `${prefix}.${key}` : key;

                if (value && typeof value === "object") {
                    if ("message" in value && typeof value.message === "string") {
                        result.push({ field: fieldPath, message: value.message });
                    } else {
                        extractErrors(value, fieldPath);
                    }
                }
            });
        };

        extractErrors(errors);
        return result;
    }, [errors]);

    // Clear submission error
    const clearSubmissionError = useCallback(() => {
        setSubmissionError(null);
    }, []);

    // Get props for a field to spread onto MUI input components
    const getFieldProps = useCallback(
        (name: Path<T>) => {
            const error = hasFieldError(name);
            const helperText = getFieldError(name);

            return {
                ...register(name),
                name,
                error,
                helperText,
            };
        },
        [register, hasFieldError, getFieldError]
    );

    // Validate the entire form without submitting
    const validateForm = useCallback(async (): Promise<boolean> => {
        log("Validating entire form");
        return await trigger();
    }, [trigger, log]);

    // Validate a single field
    const validateField = useCallback(
        async (name: Path<T>): Promise<boolean> => {
            log(`Validating field "${String(name)}"`);
            return await trigger(name);
        },
        [trigger, log]
    );

    // Memoize the result object
    const result = useMemo<UseFormResult<T>>(
        () => ({
            form,
            register: form.register,
            watch: form.watch,
            control: form.control,
            fields,
            isSubmitting,
            isSubmitted,
            isValid,
            isDirty,
            submitCount,
            handleSubmit,
            resetForm,
            setFieldValue,
            setFieldValues,
            getFieldValue,
            getAllValues,
            clearAllErrors,
            clearFieldError,
            setFieldError,
            hasFieldError,
            getFieldError,
            getAllErrors,
            submissionError,
            setSubmissionError,
            clearSubmissionError,
            getFieldProps,
            validateForm,
            validateField,
        }),
        [
            form,
            fields,
            isSubmitting,
            isSubmitted,
            isValid,
            isDirty,
            submitCount,
            handleSubmit,
            resetForm,
            setFieldValue,
            setFieldValues,
            getFieldValue,
            getAllValues,
            clearAllErrors,
            clearFieldError,
            setFieldError,
            hasFieldError,
            getFieldError,
            getAllErrors,
            submissionError,
            clearSubmissionError,
            getFieldProps,
            validateForm,
            validateField,
        ]
    );

    return result;
}

// ============================================================================
// Helper: Create typed form schema
// ============================================================================

export { z } from "zod";

// ============================================================================
// Default Export
// ============================================================================

export default useForm;