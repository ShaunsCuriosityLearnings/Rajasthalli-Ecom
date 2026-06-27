import z from "zod";
import type { ProductType } from "./product";

export type CartItemType = ProductType & {
    quantity: number;
    selectedSize: string;
}

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
    name: z.string().min(1, "Name is required!"),

    email: z.string().email("Invalid email address"),

    phone: z
        .string()
        .min(10, "Phone number must be 10 digits!")
        .max(10, "Phone number must be 10 digits!")
        .regex(/^\d+$/, "Phone number must contain only numbers!"),

    address: z.string().min(1, "Address is required!"),

    city: z.string().min(1, "City is required!"),

    state: z.string().min(1, "State is required!"),

    pincode: z
        .string()
        .length(6, "Pincode must be 6 digits!")
        .regex(/^\d+$/, "Pincode must contain only numbers!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;


export const PaymentFormSchema = z.object({
    paymentMethod: z.enum(["online", "cod"], {
        message: "Please select a payment method!",
    }),
    cardHolderName: z.string().optional(),
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z.string().optional(),
});

export type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;

export type CartStoreStateType = {
    cart: CartItemType[];
    hasHydrated: boolean;
};

export type CartStoreActionsType = {
    addToCart: (product: CartItemType) => void;
    removeFromCart: (product: CartItemType) => void;
    clearCart: () => void;
};

