// FarmFormUI.tsx
import React from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import FarmFormField from "./FarmFormField";
import { IFarmPostDocument } from "@/models/profileI-interfaces";
import { BaseFarmForm } from "@/app/profile/Farms/farmForm/BaseFarmForm";

interface FarmFormUIProps {
  initialData?: Partial<IFarmPostDocument>;
  formId?: string;
  farmId?: string;
}

const FarmFormUI: React.FC<FarmFormUIProps> = ({
  initialData,
  formId,
  farmId,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { farmProfiles } = useAppSelector((state) => state.farmProfiles);
  const currentFarmPost = farmProfiles.find((f) => f._id.toString() === formId);

  if (!userId) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96 p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Authentication Required
            </h2>
            <p className="text-center text-gray-600">
              Please log in to your account to access and manage farm listings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <BaseFarmForm
      initialData={initialData}
      farmId={farmId}
      farmProfile={currentFarmPost}
    >
      {({ form, onSubmit }) => (
        <FarmFormField form={form} onSubmit={onSubmit} />
      )}
    </BaseFarmForm>
  );
};

export default FarmFormUI;
