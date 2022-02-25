import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";


import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })
  it("Should be able to get Statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
     const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })
    expect(response.type).toBe("deposit")
  })

  it("Should not be able to get a statement operation of a non-existents user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
     const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "fake_id",
        statement_id: statement.id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to get a statement operation of a non-existents statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
     const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "fake_id"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})


