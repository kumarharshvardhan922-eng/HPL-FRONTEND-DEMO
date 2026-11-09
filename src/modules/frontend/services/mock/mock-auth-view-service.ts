import { AuthViewService, Role, SportId, User, ValidationError } from "../../types";
import { MOCK_USERS } from "../../mocks/admins-data";
import { deepClone, simulateLatency } from "./mock-utils";

export class MockAuthViewService implements AuthViewService {
  private users: User[] = deepClone(MOCK_USERS);
  // Default to Super Admin so all initial flows are demonstrable
  private currentUser: User = deepClone(this.users[0]);

  async getCurrentUser(): Promise<User> {
    await simulateLatency(100, 250);
    return deepClone(this.currentUser);
  }

  async setRole(role: Role, assignedSportIds?: SportId[]): Promise<User> {
    await simulateLatency(100, 250);
    this.currentUser = {
      ...this.currentUser,
      role,
      assignedSportIds: role === "sport_admin" ? (assignedSportIds || ["cricket"]) : undefined,
    };
    return deepClone(this.currentUser);
  }

  async getAdmins(): Promise<User[]> {
    await simulateLatency();
    return deepClone(this.users.filter((u) => u.role !== "public"));
  }

  async inviteAdmin(input: {
    email: string;
    displayName: string;
    role: Role;
    assignedSportIds?: SportId[];
  }): Promise<User> {
    await simulateLatency();
    if (!input.email || !input.email.includes("@")) {
      throw new ValidationError("Valid email address required.", { email: "Invalid email format" });
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: input.email,
      displayName: input.displayName || input.email.split("@")[0],
      role: input.role,
      assignedSportIds: input.assignedSportIds,
    };
    this.users.push(newUser);
    return deepClone(newUser);
  }
}

