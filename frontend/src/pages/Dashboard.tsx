import { useAuth } from "../auth/AuthContext";
import { Card, PageHeader } from "../ui";

export function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div data-lg-key="7a49a4218d">
      <PageHeader title="Dashboard" subtitle="This page is protected — only visible when signed in." />
      <Card>
        <div data-lg-key="64d0a2cb10" className="font-medium">{user.name || "—"}</div>
        <div data-lg-key="cfbc729f9d" className="text-muted-foreground text-sm">{user.email}</div>
      </Card>
    </div>
  );
}
