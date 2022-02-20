import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create Statement", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  let user: User;

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    user = await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test3.com",
      password: "123456",
    });
  });

  it("should create a statement for a user that does not exist", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not create a statement for an user that does not exist", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    expect(
      createStatementUseCase.execute({
        amount: 100,
        description: "Test statement",
        type: OperationType.DEPOSIT,
        user_id: 'non-existent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not create a withdraw statement for an user that hasn't sufficient funds", async () => {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    expect(
      createStatementUseCase.execute({
        amount: 10000,
        description: "Test statement",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
