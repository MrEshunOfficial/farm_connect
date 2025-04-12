"use client";
import React from "react";
import PostParentComponent from "../../post.form.components/PostParentComponent";

export default function StoreProductSellParams({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <PostParentComponent mode="store" formId={params.id} />
    </>
  );
}
