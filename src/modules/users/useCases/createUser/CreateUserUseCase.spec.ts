import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("Create User", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUserRepository: InMemoryUsersRepository;

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not create an user with an existing email", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test1.com",
      password: "123456"
    });

    await expect(
      createUserUseCase.execute({
        name: "John Doe",
        email: "test@test1.com",
        password: "123456"
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
