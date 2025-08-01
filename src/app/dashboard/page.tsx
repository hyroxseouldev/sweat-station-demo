import { Suspense } from "react";
import { CentersList } from "@/components/centers/centers-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MainHeader from "@/components/header";

// Loading components
function CentersLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CentersPage() {
  return (
    <>
      <MainHeader />
      <div className="space-y-8 container mx-auto p-6">
        {/* Page header */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">센터 관리</h1>
          <p className="text-gray-600 mt-2">
            등록된 센터를 관리하고 새로운 센터를 추가하세요
          </p>
        </div>

        {/* Centers list */}
        <Suspense fallback={<CentersLoading />}>
          <CentersList />
        </Suspense>
      </div>
    </>
  );
}
