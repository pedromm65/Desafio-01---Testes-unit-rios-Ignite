import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })
  it("Should be able to authenticate a user", async () => {
    const user = {
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    }

    await createUserUseCase.execute(user)

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })
    })
  })

  it("Should not be able to authenticate a non-existent user", async () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "35435353535",
        password: "242424242"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const user = {
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    }

    await createUserUseCase.execute(user)

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectpassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
