import { SignUpUseCase } from "../../modules/users/useCases/signUp/SignUpUseCase";
import { UsersRepositoryInMemory } from "../repositories/InMemoryUserRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { AppError } from "../../errors/AppError";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let signUpUseCase: SignUpUseCase;

describe("All User Cases tests", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    signUpUseCase = new SignUpUseCase(usersRepositoryInMemory);
  });
  it("Should allow to create a new user", async () => {
    const user = await signUpUseCase.execute({
      name: "User Test",
      username: "user_test",
      email: "user_test@example.com",
      password: "123456",
    });
    expect(user).toHaveProperty("_id");
  });
  it("Should not allow to create a new user with same email from another", async () => {
    await signUpUseCase.execute({
      name: "User Test",
      username: "user_test",
      email: "user_test@example.com",
      password: "123456",
    });

    await expect(
      signUpUseCase.execute({
        name: "User Test",
        username: "user_test_2",
        email: "user_test@example.com",
        password: "123456",
      })
    ).rejects.toEqual(new AppError("Email already registered"));
  });
  it("Should not allow to create a new user with same username from another", async () => {
    await signUpUseCase.execute({
      name: "User Test",
      username: "user_test",
      email: "user_test@example.com",
      password: "123456",
    })
    await expect(
      signUpUseCase.execute({
        name: "User Test",
        username: "user_test",  
        email: "new_user_test@example.com",
        password: "123456",
      })
    ).rejects.toEqual(new AppError("Username already registered"));
  });
});
