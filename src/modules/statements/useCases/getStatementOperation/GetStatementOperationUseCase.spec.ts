import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Get Statement Operation", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  let user: User;
  let statement: Statement;

  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    user = await createUserUseCase.execute({
      name: "John Doe",
      email: "test@test4.com",
      password: "123456",
    });

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });
  });

  it("should get a statement operation", async () => {
    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(statementOperation).toHaveProperty("id")
  });

  it("should not get the statement operation if it's user does not exist", async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: "non-existent",
        statement_id: statement.id as string,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not get the statement operation if it's statement does not exist", async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "non-existent",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
