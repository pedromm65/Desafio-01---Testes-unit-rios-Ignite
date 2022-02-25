import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })
  it("Should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Pedro Lima",
      email: "pedro@gmail.com",
      password: "12345"
    })

    const userProfile  = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id")
    expect(userProfile.name).toBe("Pedro Lima")

  })

  it("Should not be able to show a non-existent user profile", async () => {
    const id = "test"
    expect(async () => {
      const userProfile  = await showUserProfileUseCase.execute(id);
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
