import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import exp from "constants";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Do deposit and withdraw", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,inMemoryStatementsRepository
      )

  })
  it("Should be able to do a deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
    const response = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    console.log(response)

    expect(response.type).toBe("deposit")
    expect(response).toHaveProperty("id")
    expect(response.amount).toBe(1000)
  })

  it("Should not be able to do a deposit for non-existent user", async () => {


    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fake_id",
        amount: 1000,
        description: "TOMA ESSE PIX",
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  })
// -------------------------------WITHDRAW--------------------------------------
  it("Should be able to do a withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    const response = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 500,
      description: "DEVOLVEEEEEEE",
      type: OperationType.WITHDRAW
    })

    expect(response.amount).toBe(500)
    expect(response).toHaveProperty("id")

  })

  it("Should not be able to do a withdraw for non-existent user", async () => {

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fake_id",
        amount: 1000,
        description: "TOMA ESSE PIX",
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  })

  it("Should not be able to do a withdraw with insufficient funds", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 1500,
        description: "DEVOLVEEEEEEE",
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)


  })

})


