import { AuthViewService, Role, SportId, User, ValidationError } from "../../types";

export class DemoAuthViewService implements AuthViewService {
  private currentUser: User = {
    id: "user-demo-admin",
    email: "demo-admin@hpl.ac.in",
    displayName: "Tournament Demo Admin",
    role: "super_admin",
    isDemo: true,
  };

  private admins: User[] = [this.currentUser];

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

