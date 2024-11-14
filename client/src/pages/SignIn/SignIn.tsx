import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/authProvider";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string(),
});

type FormFields = z.infer<typeof schema>;

function SignIn() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const { signIn, accessToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signIn(data);
      navigate("/");
    } catch (error) {
      setError("root", {
        message:
          error?.response?.data?.response?.message || "Authentication failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Sign In
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
            {!isSubmitting ? "Sign in" : "Signing in..."}
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
            onClick={() => navigate("/sign-up")}
          >
            Don't have an account? Sign up
          </button>
        </div>

        <div className="mt-4 text-center text-gray-600">
          {accessToken ? "Authenticated" : "Not Authenticated"}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
