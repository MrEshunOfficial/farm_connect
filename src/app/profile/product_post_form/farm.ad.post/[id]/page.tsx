"use client";
import React from "react";
import PostParentComponent from "../../post.form.components/PostParentComponent";

export default function FarmProduceSellParams({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="container">
      <PostParentComponent mode="farm" formId={params.id} />
    </main>
  );
}
