import { AuthViewService, Role, SportId, User, ValidationError } from "../../types";
import { SHOWCASE_ADMINS, SHOWCASE_SUPER_ADMIN } from "../../showcase/showcase";

export class DemoAuthViewService implements AuthViewService {
  private currentUser: User = { ...SHOWCASE_SUPER_ADMIN };
  private admins: User[] = SHOWCASE_ADMINS.map((a) => ({ ...a }));

  async getCurrentUser(): Promise<User> {
    return { ...this.currentUser };
  }

  async setRole(role: Role, assignedSportIds?: SportId[]): Promise<User> {
    const sports = role === "sport_admin" ? (assignedSportIds || ["cricket"]) : undefined;
    this.currentUser = {
      ...this.currentUser,
      role,
      assignedSportIds: sports,
      assignedSports: sports,
    };
    return { ...this.currentUser };
  }

  async getAdmins(): Promise<User[]> {
    return [...this.admins];
  }

  async inviteAdmin(input: {
    email: string;
    displayName: string;
    role: Role;
    assignedSportIds?: SportId[];
  }): Promise<User> {
    if (!input.email || !input.email.includes("@")) {
      throw new ValidationError("Valid email address required.", { email: "Invalid email format" });
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: input.email,
      displayName: input.displayName || input.email.split("@")[0],
      role: input.role,
      assignedSportIds: input.assignedSportIds,
      isDemo: true,
    };
    this.admins.push(newUser);
    return { ...newUser };
  }
}

