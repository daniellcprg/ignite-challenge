import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authenticate User", () => {
  let inMemoryUserRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);

    await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test2.com",
      password: "123456",
    });
  });

  it("should authenticate an user", async () => {
    const data = await authenticateUserUseCase.execute({
      email: "test@test2.com",
      password: "123456",
    });

    expect(data).toHaveProperty("token");
  });

  it("should not authenticate an user with incorrect credentials", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "test@test",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticateUserUseCase.execute({
        email: "test@test2.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
