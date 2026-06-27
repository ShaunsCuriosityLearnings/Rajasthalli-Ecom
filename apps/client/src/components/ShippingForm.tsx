"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingFormInputs, shippingFormSchema } from "@repo/types";
import { useRouter } from "next/navigation";

const ShippingForm = ({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
  });

  const router = useRouter();

  const handleShippingForm: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingForm(data);
    router.push("/cart?step=3", { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit(handleShippingForm)}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-2xl font-semibold">Shipping Information</h2>

        <p className="text-sm text-gray-500 mt-1">
          Enter your delivery details below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Full Name</label>

          <input
            {...register("name")}
            placeholder="John Doe"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>

          <input
            {...register("email")}
            placeholder="john@example.com"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone Number</label>

          <input
            {...register("phone")}
            placeholder="9876543210"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* CITY */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">City</label>

          <input
            {...register("city")}
            placeholder="Mumbai"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.city && (
            <p className="text-red-500 text-xs">{errors.city.message}</p>
          )}
        </div>

        {/* STATE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">State</label>

          <input
            {...register("state")}
            placeholder="Maharashtra"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.state && (
            <p className="text-red-500 text-xs">{errors.state.message}</p>
          )}
        </div>

        {/* PINCODE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Pincode</label>

          <input
            {...register("pincode")}
            placeholder="400001"
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green"
          />

          {errors.pincode && (
            <p className="text-red-500 text-xs">{errors.pincode.message}</p>
          )}
        </div>
      </div>

      {/* ADDRESS */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Full Address</label>

        <textarea
          {...register("address")}
          rows={4}
          placeholder="Enter complete delivery address..."
          className="border border-gray-300 rounded-xl p-3 outline-none focus:border-primary-green resize-none"
        />

        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-primary-green hover:bg-primary-green-hover text-white py-3.5 rounded-xl font-semibold transition uppercase tracking-wider text-xs cursor-pointer shadow-xs hover:shadow-md mt-4"
      >
        Save Shipping Details
      </button>
    </form>
  );
};

export default ShippingForm;
