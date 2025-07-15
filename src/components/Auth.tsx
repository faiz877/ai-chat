import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

const schema = z.object({
  countryCode: z.string().nonempty("Select a country"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

function Auth() {
  const [countries, setCountries] = useState([]);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => res.json())
      .then((data) => {
        const codes = data
          .map((c) => {
            const root = c.idd?.root;
            const suffix = c.idd?.suffixes?.[0];
            if (!root || !suffix) return null;
            return {
              name: c.name.common,
              code: `${root}${suffix}`,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(codes);
      });
  }, []);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setOtpSent(true);
    setTimeout(() => {
      toast.success("OTP Verified!");
    }, 1000);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 p-6 border rounded w-full max-w-sm'
      >
        <div>
          <label>Country Code</label>
          <select
            {...register("countryCode")}
            className='w-full p-2 border rounded'
          >
            <option value=''>Select Country</option>
            {countries.map((c) => (
              <option key={`${c.name}-${c.code}`} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          {errors.countryCode && (
            <p className='text-red-500'>{errors.countryCode.message}</p>
          )}
        </div>

        <div>
          <label>Phone</label>
          <input
            {...register("phone")}
            placeholder='Phone'
            className='w-full p-2 border rounded'
          />
          {errors.phone && (
            <p className='text-red-500'>{errors.phone.message}</p>
          )}
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {otpSent ? "Verifying..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
