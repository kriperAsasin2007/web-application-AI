import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/authProvider";

const schema = z.object({
  email: z.string().email(),
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
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signIn(data);
    } catch (error) {
      console.log({ error });
      setError("root", {
        message: error?.response?.data?.response?.message,
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
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
          {!isSubmitting ? "Sign in" : "...Loading"}
        </button>
        {errors.root && <p>{errors.root.message}</p>}
      </form>
      {accessToken ? <p>Auth</p> : <p>Not Auth</p>}
    </div>
  );
}

export default SignIn;
