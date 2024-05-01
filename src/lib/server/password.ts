import bcrypt from "bcrypt";

export const verifyPassword = async (password: string) => {
    const hashedPassword = "$2b$10$ZH9LxAdZ9G/G2Sa52BFYm.w8IxgVmPuRz/2WGuQpnnKnfIvRewFNu";

    const valid = await bcrypt.compare(password, hashedPassword)

    return valid;
}