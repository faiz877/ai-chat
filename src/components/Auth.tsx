import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  countryCode: z.string().nonempty("Select a country"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

function Auth() {
  const [countries, setCountries] = useState([]);
  const [otpSent, setOtpSent] = useState(false);
  const login = useAuthStore((state) => state.login);

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
    toast.loading("Sending OTP...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("OTP Verified! Redirecting...");
      setOtpSent(false);
      login();
    }, 2000);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h2 className='text-3xl font-bold text-center mb-6'>
          Welcome to Gemini
        </h2>
        <p className='text-gray-400 text-center mb-8'>Sign in to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Phone Number Input */}
          <div>
            <label
              htmlFor='phone-number'
              className='block text-gray-300 text-sm font-bold mb-2'
            >
              📞 Phone number
            </label>
            <p className='text-gray-500 text-xs mb-2'>
              We'll send you a verification code
            </p>
            <div className='flex space-x-2'>
              <select
                {...register("countryCode")}
                className='flex-none p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-white'
              >
                <option value=''>Select</option>
                {countries.map((c) => (
                  <option key={`${c.name}-${c.code}`} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                id='phone-number'
                {...register("phone")}
                type='tel' // Use type="tel" for phone numbers
                placeholder='+1 Phone number'
                className='flex-grow p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-white'
              />
            </div>
            {errors.countryCode && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.countryCode.message}
              </p>
            )}
            {errors.phone && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.phone.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200'
            disabled={otpSent}
          >
            {otpSent ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      </div>
      {/* Moon icon for Dark Mode Toggle - Placeholder */}
      <div className='absolute top-4 right-4 text-gray-500 cursor-pointer text-xl'>
        🌙
      </div>
    </div>
  );
}

export default Auth;
