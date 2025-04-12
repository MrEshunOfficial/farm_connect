"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/store";
import {
  IFarmProfileForm,
  farmProfileFormSchema,
  defaultFarmProfileFormValues,
} from "@/store/type/farmProfileTypes";
import { createFarmProfile, updateFarmProfile } from "@/store/farm.slice";
import { FarmProfileFormUI } from "./FarmProfileFormUI";
import { useAppSelector } from "@/store/hooks";

interface FarmProfileFormContainerProps {
  initialData?: Partial<IFarmProfileForm>;
  farmId?: string;
  mode?: "create" | "edit";
}

const FarmProfileFormContainer: React.FC<FarmProfileFormContainerProps> = ({
  initialData = {},
  farmId,
  mode = "create",
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { farmProfiles, loading } = useAppSelector(
    (state) => state.farmProfiles
  );

  const farm = farmProfiles.find((f) => f._id.toString() === farmId);

  const form = useForm<IFarmProfileForm>({
    resolver: zodResolver(farmProfileFormSchema),
    defaultValues: {
      ...defaultFarmProfileFormValues,
      ...initialData,
    },
  });

  useEffect(() => {
    if (mode === "edit" && farm) {
      form.reset({
        ...defaultFarmProfileFormValues,
        ...farm,
        farmType: farm.farmType || defaultFarmProfileFormValues.farmType,
        belongsToCooperative:
          farm.belongsToCooperative ||
          defaultFarmProfileFormValues.belongsToCooperative,
      });
    }
  }, [farm, mode, form]);

  const farmType = form.watch("farmType");
  const belongsToCooperative = form.watch("belongsToCooperative");

  const handleSubmit = async (data: IFarmProfileForm) => {
    try {
      const sanitizedData = {
        userId,
        ...data,
      };

      if (mode === "edit" && farmId) {
        await dispatch(
          updateFarmProfile({
            id: farmId,
            basicInfo: sanitizedData,
          })
        );
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        await dispatch(createFarmProfile(sanitizedData));
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
      }
      router.push(`/profile/Farms/${farmId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          mode === "edit" ? "update" : "create"
        } profile`,
        variant: "destructive",
      });
    }
  };

  if (mode === "edit" && loading === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full h-full flex items-center justify-center">
      <FarmProfileFormUI
        form={form}
        onSubmit={handleSubmit}
        farmType={farmType}
        belongsToCooperative={belongsToCooperative}
        mode={mode}
      />
    </main>
  );
};

export default FarmProfileFormContainer;
