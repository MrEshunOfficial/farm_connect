import FarmProfileFormContainer from "../../farmForm/FarmProfileFormContainer";

// app/profile/Farms/edit/[farmId]/page.tsx
export default function EditFarmPage({
  params,
}: {
  params: { farmId: string };
}) {
  return <FarmProfileFormContainer mode="edit" farmId={params.farmId} />;
}
