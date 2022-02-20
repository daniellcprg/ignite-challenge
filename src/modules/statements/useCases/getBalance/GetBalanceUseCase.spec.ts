import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get Balance", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  let user: User;

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );

    user = await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test3.com",
      password: "123456",
    });

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await createStatementUseCase.execute({
      amount: 100,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });
  });

  it("should get an user's balance", async () => {
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("statement")
  });

  it("should not get the balance if it's user does not exist", async () => {
    expect(
      getBalanceUseCase.execute({
        user_id: "non-existent",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
