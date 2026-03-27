import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    IconButton,
    Paper,
    Typography,
    TextField,
} from "@mui/material";
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCart } from "../../../cart/cart";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import LineThroughTitle from "../../../components/LineThroughTitle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import PaymentIcon from "@mui/icons-material/Payment";
import axiosClient from "../../../axios-client";
import { Formik } from "formik";
import * as yup from "yup";
import { Form } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCardInput from "../../../components/StripeCardInput";
import { useNavigate } from "react-router-dom";
const stripePromise = loadStripe(
    "pk_test_51Rg5nOQXFZRxFvJKt5ZxUWEwICXz5Jp1mccv8Wq12758EJ8ZqD6VxwXv4iUXhNOx1tHKYqZkUOgqSSAO0Qj0Bt3H006tV5gU42"
);
const initialValues = {
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
};

const validationSchema = yup.object({
    phoneNumber: yup.string().required("Phone Number is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup.string().required("Zip Code is required"),
});

const Cart = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));
    const {
        cart,
        getCartTotal,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeFromCart,
        clearCart,
    } = useCart((state) => ({
        cart: state.cart,
        getCartTotal: state.getCartTotal,
        increaseItemQuantity: state.increaseItemQuantity,
        decreaseItemQuantity: state.decreaseItemQuantity,
        removeFromCart: state.removeFromCart,
        clearCart: state.clearCart,
    }));
    console.log(cart);
    const [loading, setLoading] = useState(false);

    const handleMakePayment = async (values) => {
        setLoading(true);
        try {
            const res = await axiosClient.post("api/payments/make-payment", {
                cart,
                customerInfo: values,
            });
            const { clientSecret } = res.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        phone: values.phoneNumber,
                        address: {
                            line1: values.address,
                            city: values.city,
                            state: values.state,
                            postal_code: values.zipCode,
                        },
                    },
                },
            });

            if (result.error) {
                console.error(result.error);
                alert("Payment failed: " + result.error.message);
            } else {
                const transactionId = result.paymentIntent.id;
                alert("Payment successful!");
                const { status } = await axiosClient.post("api/orders", {
                    cart,
                    total: getCartTotal(),
                    customerInfo: values,
                    transaction_id: transactionId,
                });
                console.log("Order status:", status);
                // Clear Cart
                clearCart();
                // Redirect
                navigate("/orders");
            }
        } catch (error) {
            console.error("Payment error:", error);
            console.error("Error response:", error.response?.data);
            alert("Payment failed: " + (error.response?.data?.message || error.message || "Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            margin={matches ? "20px 200px" : "20px 20px"}
            display="flex"
            gap={5}
        >
            <Paper
                sx={{
                    width: "70%",
                    padding: "20px",
                    margin: "20px auto",
                    borderRadius: "20px",
                }}
                elevation={5}
            >
                <Box my={2}>
                    {cart?.map((watch) => (
                        <Box
                            display="flex"
                            gap={2}
                            borderBottom="1px solid #CFCFCF"
                            alignItems="center"
                        >
                            <Box border="1px solid #CFCFCF" borderRadius="10px">
                                <img
                                    width="200"
                                    src={watch.front}
                                    alt={watch.name}
                                    sx={{ borderRadius: "10px" }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="bolder"
                                    color="gray"
                                >
                                    {watch.brand}
                                    {watch.name} - Dial Size {watch.dialSize} -
                                    Glass Material {watch.glassMaterial} -{" "}
                                    {watch.gender}${watch.price}
                                    {watch.description}
                                </Typography>
                                <Box my={1} display="flex" alignItems="center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() =>
                                            decreaseItemQuantity(watch.id)
                                        }
                                    >
                                        <RemoveCircleOutlineOutlinedIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h5">
                                        {watch.quantity}
                                    </Typography>
                                    <IconButton
                                        aria-label="add"
                                        onClick={() =>
                                            increaseItemQuantity(watch.id)
                                        }
                                    >
                                        <ControlPointOutlinedIcon fontSize="large" />
                                    </IconButton>
                                    <Typography variant="h5">
                                        ${watch.total}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        aria-label="delete"
                                        startIcon={
                                            <DeleteForeverIcon fontSize="large" />
                                        }
                                        onClick={() => removeFromCart(watch.id)}
                                    >
                                        <Typography variant="h5">
                                            Remove
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Divider />
                <Box my={2} display="flex" justifyContent="space-between">
                    <Typography variant="h5">Subtotal:</Typography>
                    <Typography variant="h5">${getCartTotal()}</Typography>
                </Box>
                <Divider />
                <Box my={2} display="flex" justifyContent="space-between">
                    <Typography variant="h4" fontWeight="bold">
                        Total:
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        ${getCartTotal()}
                    </Typography>
                </Box>
                <Divider />

                {/* Address Input + Checkout Button */}
                <Box my={2}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleMakePayment}
                        validationSchema={validationSchema}
                    >
                        {(formik) => {
                            return (
                                <form onSubmit={formik.handleSubmit}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        rowGap={4}
                                    >
                                        {/* Phone Number */}
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            name="phoneNumber"
                                            label="Phone Number"
                                            {...formik.getFieldProps(
                                                "phoneNumber"
                                            )}
                                            error={
                                                formik.touched.phoneNumber &&
                                                formik.errors.phoneNumber
                                            }
                                            helperText={
                                                formik.touched.phoneNumber &&
                                                formik.errors.phoneNumber
                                            }
                                        />

                                        {/* Address */}
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            name="address"
                                            label="Address"
                                            {...formik.getFieldProps("address")}
                                            error={
                                                formik.touched.address &&
                                                formik.errors.address
                                            }
                                            helperText={
                                                formik.touched.address &&
                                                formik.errors.address
                                            }
                                        />
                                        {/* City */}
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            name="city"
                                            label="City"
                                            {...formik.getFieldProps("city")}
                                            error={
                                                formik.touched.city &&
                                                formik.errors.city
                                            }
                                            helperText={
                                                formik.touched.city &&
                                                formik.errors.city
                                            }
                                        />
                                        {/* State */}
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            name="state"
                                            label="State"
                                            {...formik.getFieldProps("state")}
                                            error={
                                                formik.touched.state &&
                                                formik.errors.state
                                            }
                                            helperText={
                                                formik.touched.state &&
                                                formik.errors.state
                                            }
                                        />
                                        {/* Zip Code */}
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            name="zipCode"
                                            label="Zip Code"
                                            {...formik.getFieldProps("zipCode")}
                                            error={
                                                formik.touched.zipCode &&
                                                formik.errors.zipCode
                                            }
                                            helperText={
                                                formik.touched.zipCode &&
                                                formik.errors.zipCode
                                            }
                                        />
                                        <StripeCardInput />
                                        <LoadingButton
                                            loading={loading}
                                            endIcon={<PaymentIcon />}
                                            color="primary"
                                            type="submit"
                                            variant="contained"
                                            loadingPosition="center"
                                        >
                                            Make Payment
                                        </LoadingButton>
                                    </Box>
                                </form>
                            );
                        }}
                    </Formik>
                </Box>
            </Paper>
        </Box>
    );
};

export default function StripeWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Cart />
        </Elements>
    );
}
