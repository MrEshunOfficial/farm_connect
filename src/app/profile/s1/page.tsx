// For the farm page, here's the fixed version:
// src/app/profile/farm/page.tsx (or wherever your farm page is)
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchFarmProfiles } from "@/store/farm.slice";
import { IFarmPostDocument, IFarmProfile } from "@/models/profileI-interfaces";
import FarmFormField from "../product_post_form/post.form.components/farmpostui/FarmFormField";
import { BaseFarmForm } from "../Farms/farmForm/BaseFarmForm";
import SelectFarmComponent from "../f1/SelectFarmComponent";

interface FarmPostFormProps {
  initialData?: Partial<IFarmPostDocument>;
  farmId?: string;
}

const FarmPostForm: React.FC<FarmPostFormProps> = ({ initialData, farmId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { farmProfiles } = useAppSelector((state) => state.farmProfiles);
  const [selectedFarm, setSelectedFarm] = useState<IFarmProfile | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchFarmProfiles({ userId: userId }));
    }
  }, [dispatch, userId]);

  return (
    <>
      {!selectedFarm ? (
        <SelectFarmComponent
          farmProfiles={farmProfiles}
          selectedFarm={selectedFarm}
          setSelectedFarm={setSelectedFarm}
        />
      ) : (
        <div className="mt-2 relative">
          <h2 className="font-semibold absolute top-0 left-0 text-gray-800 dark:text-gray-100">
            Selected Farm: {selectedFarm.farmName}
          </h2>
          <BaseFarmForm
            initialData={initialData}
            farmId={farmId}
            farmProfile={selectedFarm}
          >
            {({ form, onSubmit }) => (
              <FarmFormField form={form} onSubmit={onSubmit} />
            )}
          </BaseFarmForm>
        </div>
      )}
    </>
  );
};

// THIS IS THE KEY FIX: Export the component as default, not the interface
export default FarmPostForm;
