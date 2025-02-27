"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchFarmProfiles } from "@/store/farm.slice";
import { IFarmPostDocument, IFarmProfile } from "@/models/profileI-interfaces";
import FarmFormField from "../product_post_form/post.form.components/farmpostui/FarmFormField";
import SelectFarmComponent from "./SelectFarmComponent";
import { BaseFarmForm } from "../Farms/farmForm/BaseFarmForm";

interface FarmPostFormProps {
  initialData?: Partial<IFarmPostDocument>;
  farmId?: string;
}
export default function FarmPostForm({
  initialData,
  farmId,
}: FarmPostFormProps) {
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
}
