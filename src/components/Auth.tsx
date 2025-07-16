import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const schema = z.object({
  countryCode: z.string().nonempty("Select a country"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// Add type for country
interface Country {
  name: string;
  code: string;
}

function Auth() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { theme, toggleTheme } = useThemeStore();

  // Set theme on body
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => res.json())
      .then((data: any[]) => {
        const codes: Country[] = data
          .map((c: any) => {
            const root = c.idd?.root;
            const suffix = c.idd?.suffixes?.[0];
            if (!root || !suffix) return null;
            return {
              name: c.name.common,
              code: `${root}${suffix}`,
            };
          })
          .filter(Boolean) as Country[];
        codes.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(codes);
      });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle country select change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setValue("countryCode", code);
    const country = countries.find((c) => c.code === code) || null;
    setSelectedCountry(country);
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    setOtpSent(true);
    toast.loading("Sending OTP...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("OTP Verified!");
      setOtpSent(false);
      login();
    }, 2000);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4 sm:p-6 md:p-4 font-sans transition-colors duration-300 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-950 text-white"
      }`}
    >
      {/* Top right theme toggle */}
      <div className='absolute top-4 right-4'>
        <button
          onClick={toggleTheme}
          className='p-2 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white light:bg-white light:text-gray-900'
          aria-label='Toggle dark/light mode'
        >
          {theme === "dark" ? (
            // Moon icon
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z'
              />
            </svg>
          ) : (
            // Sun icon
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <circle
                cx='12'
                cy='12'
                r='5'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m13.9 0l-1.41 1.41M6.46 17.54l-1.41 1.41'
              />
            </svg>
          )}
        </button>
      </div>
      {/* Card wrapper for the form */}
      <div
        className={`w-full max-w-md rounded-xl shadow-lg p-6 md:p-8 transition-colors duration-300 ${
          theme === "light"
            ? "bg-white border border-gray-200"
            : "bg-gray-900 border border-gray-800"
        }`}
      >
        <div className='text-center mb-6 md:mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-2'>Welcome to Gemini</h1>
          <p className='text-gray-400 dark:text-gray-400 light:text-gray-600'>
            Sign in to continue
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2 dark:text-gray-300 light:text-gray-700'>
              Enter your phone number
            </label>
            <p className='text-xs text-gray-500 mb-3 dark:text-gray-500 light:text-gray-500'>
              We'll send you an OTP to verify your number.
            </p>
            {/* Country dropdown: name + code on one line */}
            <div className='mb-3'>
              <select
                {...register("countryCode")}
                id="country-code"
                aria-describedby="country-code-error"
                onChange={handleCountryChange}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-gray-800 border-gray-700 text-white"
                }`}
                defaultValue=''
              >
                <option value=''>Select country</option>
                {countries.map((c: Country) => (
                  <option key={`${c.name}-${c.code}`} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.countryCode && (
                <p id="country-code-error" className='text-red-400 text-xs mt-2'>
                  {errors.countryCode.message}
                </p>
              )}
            </div>
            {/* Selected country code and phone input on next line */}
            <div className='flex items-center space-x-2'>
              <div className='w-1/3'>
                <input
                  type='text'
                  value={selectedCountry ? selectedCountry.code : ""}
                  readOnly
                  className={`w-full p-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-gray-800 border-gray-700 text-white"
                  }`}
                  placeholder='+XX'
                  tabIndex={-1}
                />
              </div>
              <div className='w-2/3'>
                <input
                  id='phone-number'
                  {...register("phone")}
                  type='tel'
                  placeholder='Phone number'
                  autoComplete='tel'
                  aria-describedby="phone-error"
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  }`}
                />
                {errors.phone && (
                  <p id="phone-error" className='text-red-400 text-xs mt-2'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:bg-gray-600'
            disabled={otpSent}
          >
            {otpSent ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
