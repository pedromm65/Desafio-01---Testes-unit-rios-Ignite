import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("List balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })
  it("Should be able to return balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })
    await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1000,
      description: "TOMA ESSE PIX",
      type: OperationType.DEPOSIT
    })

    const balance = await inMemoryStatementsRepository.getUserBalance({
      user_id: user.id
    })

    expect(balance).toHaveProperty("balance")
    expect(balance.balance).toBe(1000)
  })

  it("Should not be able to return balance of a non-existent user", async () => {
      expect(async () => {
        await getBalanceUseCase.execute({
          user_id: "fake_id"
        })
      }).rejects.toBeInstanceOf(GetBalanceError)
    })
})
