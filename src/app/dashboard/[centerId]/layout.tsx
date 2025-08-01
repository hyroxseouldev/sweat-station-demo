import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface CenterDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    centerId: string;
  }>;
}

export default async function CenterDetailLayout({
  children,
  params,
}: CenterDetailLayoutProps) {
  const { centerId } = await params;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar centerId={centerId} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with center context */}
        <Header centerId={centerId} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
