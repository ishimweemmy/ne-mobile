import { z } from "zod";

const passwordValidationSchema = z
  .string()
  .refine((value) => /(?=.*?[A-Z])/.test(value), {
    message: "password must have atleast one upper case letter",
  })
  .refine((value) => /(?=.*?[a-z])/.test(value), {
    message: "password must have atleast one lower case letter",
  })
  .refine((value) => /(?=.*?[0-9])/.test(value), {
    message: "password must have atleast one digit",
  })
  .refine((value) => /(?=.*?[#?!@$%^&*-])/.test(value), {
    message: "password must have one special character",
  })
  .refine((value) => /.{8,}/.test(value), {
    message: "password should be greater or equal to 8 character",
  });

const emailPasswordValidate = {
  email: z
    .string()
    .email({ message: "Invalid email, please input valid email" }),
  password: passwordValidationSchema,
};

const SignInFormSchema = z.object(emailPasswordValidate);
const SignUpFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should be atleast 3 characters" }),
  ...emailPasswordValidate,
});

export { SignInFormSchema, SignUpFormSchema };
