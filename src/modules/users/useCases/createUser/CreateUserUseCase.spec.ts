import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })
  it("Should be able to create a new user", async() => {
    const user = {
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    }

    const response = await inMemoryUsersRepository.create(user)
    expect(response).toHaveProperty("id")
  })

  it("Should not be able to create a new user with existent email", async() => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Pedro Lima",
        email: "pedro@gmail.com",
        password: "12345"
      })

      await createUserUseCase.execute({
        name: "Pedro Lima",
        email: "pedro@gmail.com",
        password: "12345"
      })
    }).rejects.toBeInstanceOf(CreateUserError)

  })
  

})
