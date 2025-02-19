"use client";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchProfileByParams, selectMyProfile } from "@/store/profile.slice";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const UserFeedbackPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const paramsId = params.id as string;
  const activeProfile = useAppSelector(selectMyProfile);

  useEffect(() => {
    if (paramsId) {
      dispatch(fetchProfileByParams(paramsId));
    }
  }, [dispatch, paramsId]);

  return (
    <main className="container max-w-4xl mx-auto p-4">
      <h1>Feedback for {activeProfile?.fullName}</h1>
    </main>
  );
};

export default UserFeedbackPage;
