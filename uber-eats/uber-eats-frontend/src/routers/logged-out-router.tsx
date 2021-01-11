import { useForm } from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch("email"));
  };
  const onInvalid = () => {};

  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            ref={register({
              required: "This is Required",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            type="email"
            name="email"
            placeholder="email"
          />
          {errors.email?.message && (
            <span className="font-bole text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="font-bole text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            ref={register({ required: true })}
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
