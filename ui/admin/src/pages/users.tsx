import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, MoreHorizontal, Trash2, Pencil, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/use-users";
import { useUIStore } from "@/store/ui-store";
import { createUserSchema, type CreateUserFormValues } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import type { User, UserStatus, UserRole } from "@/types";

const STATUS_VARIANT: Record<UserStatus, "success" | "pending" | "destructive"> = {
  active: "success",
  pending: "pending",
  inactive: "destructive",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary",
  editor: "bg-warning/10 text-warning",
  viewer: "bg-muted text-muted-foreground",
};

// Mock users for demo (real data comes from API via useUsers hook)
const MOCK_USERS: User[] = [
  { id: "1", name: "Alice Chen", email: "alice@example.com", role: "admin", status: "active", department: "Engineering", createdAt: "2024-01-15T00:00:00Z", lastActiveAt: new Date().toISOString() },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "editor", status: "active", department: "Marketing", createdAt: "2024-02-20T00:00:00Z", lastActiveAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "3", name: "Carol Jones", email: "carol@example.com", role: "viewer", status: "pending", department: "Sales", createdAt: "2024-03-10T00:00:00Z" },
  { id: "4", name: "David Kim", email: "david@example.com", role: "editor", status: "inactive", department: "Design", createdAt: "2024-01-05T00:00:00Z" },
  { id: "5", name: "Emma Wilson", email: "emma@example.com", role: "admin", status: "active", department: "Engineering", createdAt: "2023-12-01T00:00:00Z", lastActiveAt: new Date(Date.now() - 7200_000).toISOString() },
];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { addToast } = useUIStore();

  // TanStack Query – swap placeholderData for real API
  const { data, isLoading } = useUsers({ search, limit: 20 });
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  // Use placeholder mock data when API not connected
  const users = data?.data ?? MOCK_USERS;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserFormValues) {
    try {
      await createUser.mutateAsync(values);
      addToast({ title: "User created", description: `${values.name} has been added.`, variant: "success" });
      setCreateOpen(false);
      reset();
    } catch {
      addToast({ title: "Error", description: "Failed to create user.", variant: "destructive" });
    }
  }

  async function handleDelete(user: User) {
    try {
      await deleteUser.mutateAsync(user.id);
      addToast({ title: "User deleted", description: `${user.name} was removed.` });
    } catch {
      addToast({ title: "Error", description: "Could not delete user.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage team members and their permissions.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Badge variant="secondary" className="text-xs">
              {filtered.length} users
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-6 py-3">User</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Role</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Department</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Joined</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-full max-w-[120px]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filtered.map((user) => {
                      const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                      return (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${ROLE_COLORS[user.role]}`}>
                              {user.role === "admin" && <UserCheck className="h-3 w-3" />}
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{user.department ?? "—"}</td>
                          <td className="px-4 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <Pencil className="h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(user)}
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-medium">No users found</p>
                <p className="text-sm mt-1">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
            <DialogDescription>Fill in the details to invite a new team member.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full name" error={errors.name?.message} required>
              <Input placeholder="Jane Doe" {...register("name")} />
            </FormField>

            <FormField label="Email address" error={errors.email?.message} required>
              <Input type="email" placeholder="jane@example.com" {...register("email")} />
            </FormField>

            <FormField label="Role" error={errors.role?.message} required>
              <Select onValueChange={(v) => setValue("role", v as "admin" | "editor" | "viewer")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Department" error={errors.department?.message}>
              <Input placeholder="Engineering" {...register("department")} />
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); reset(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
