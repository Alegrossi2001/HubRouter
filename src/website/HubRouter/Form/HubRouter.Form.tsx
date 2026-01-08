import z from "zod";
import useForm from "../../../features/form/useForm";
import type { HubRouterFormContactInfo } from "./HubRouter.Interfaces";
import AGBox from "../../../library/components/AGBox";
import AGTitle from "../../../library/components/AGTitle";
import AGRichText from "../../../library/components/AGRichText";
import { Grid } from "@mui/material";
import { AGTextField } from "../../../library/components/AGFormComponent";
import AGButton from "../../../library/components/AGButton";

const contactSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    phone: z.string().optional(),
});
const HubRouterForm = () => {

    const formData = useForm<HubRouterFormContactInfo>({
        schema: contactSchema,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            phone: "",
        },
        onSubmit: async (data) => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form submitted:", data);
            alert(`Thank you, ${data.firstName}! We'll be in touch.`);
            formData.resetForm();
        },
        onError: (errors) => {
            console.log("Validation errors:", errors);
        },
        resetOnSuccess: true,
        debug: true,
    })

    return (
        <AGBox maxWidth={900} margin="0 auto" padding={6} paddingTop={40}>
            <AGBox backgroundMode={"solid"} bgColor="#FFFF" rounded={9} padding={25} component="form" onSubmit={formData.handleSubmit}>
                <AGTitle variant="h4" align="center" gutterBottom>
                    Secure Your Founding Spot
                </AGTitle>
                <AGRichText variant="body1" align="center" color="textSecondary">
                    Join the exclusive group shaping the future of HubSpot lead routing
                </AGRichText>
                <Grid container spacing={2} marginTop={2} component="form" onSubmit={formData.handleSubmit}>
                    <Grid size={6}>
                        <AGTextField
                            label="First Name"
                            {...formData.getFieldProps("firstName")}
                            error={!!formData.control.getFieldState("firstName").error}
                            helperText={formData.control.getFieldState("firstName").error?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <AGTextField
                            label="Last Name"
                            {...formData.getFieldProps("lastName")}
                            error={!!formData.control.getFieldState("lastName").error}
                            helperText={formData.control.getFieldState("lastName").error?.message}
                        />
                    </Grid>
                </Grid>
                <AGTextField
                    label="Email Address"
                    {...formData.getFieldProps("email")}
                    error={!!formData.control.getFieldState("email").error}
                    helperText={formData.control.getFieldState("email").error?.message}
                    sx={{ marginTop: 2 }}
                />
                <Grid container spacing={2} marginTop={2} component="form" onSubmit={formData.handleSubmit}>
                    <Grid size={6}>
                        <AGTextField
                            label="Company Name (Optional)"
                            {...formData.getFieldProps("company")}
                            error={!!formData.control.getFieldState("company").error}
                            helperText={formData.control.getFieldState("company").error?.message}
                        />
                    </Grid>
                    <Grid size={6}>
                        <AGTextField
                            label="Phone Number (Optional)"
                            {...formData.getFieldProps("phone")}
                            error={!!formData.control.getFieldState("phone").error}
                            helperText={formData.control.getFieldState("phone").error?.message}
                        />
                    </Grid>
                </Grid>

                <AGButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ marginTop: 3 }}
                    disabled={formData.isSubmitting}
                >
                    {formData.isSubmitting ? "Submitting..." : "Join the Waitlist"}
                </AGButton>
            </AGBox>
        </AGBox>
    );
}

export default HubRouterForm;