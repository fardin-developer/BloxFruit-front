import DashboardLayout from "./DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
