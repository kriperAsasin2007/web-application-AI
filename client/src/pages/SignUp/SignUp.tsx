import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import AuthContext, { useAuth } from "../../context/authProvider";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(4),
  password: z.string().min(6),
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
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signUp(data);
      console.log(data);
    } catch (error) {
      setError("root", {
        message: error.response.data.response.message,
      });
    }
  };
  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <input
          {...register("email")}
          type="text"
          placeholder="Email"
          className="border p-2 rounded"
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          {...register("username")}
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {!isSubmitting ? "Sign up" : "...Loading"}
        </button>
        {errors.root && <p>{errors.root.message}</p>}
      </form>
    </div>
  );
}

export default SignUp;
