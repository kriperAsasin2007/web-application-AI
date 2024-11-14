import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/authProvider";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormFields = z.infer<typeof schema>;

function SignUp() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signUp(data);
      navigate("/");
    } catch (error) {
      setError("root", {
        message: error?.response?.data?.response?.message || "Sign up failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Sign Up
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <input
              {...register("email")}
              type="text"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded hover:bg-blue-600 transition duration-200"
            disabled={isSubmitting}
          >
            {!isSubmitting ? "Sign up" : "Signing up..."}
          </button>

          {errors.root && (
            <p className="text-red-500 text-center text-sm mt-4">
              {errors.root.message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/sign-in")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
