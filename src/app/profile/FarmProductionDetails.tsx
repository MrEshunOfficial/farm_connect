import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Bird,
  Fish,
  TreeDeciduous,
  Package,
  TractorIcon,
} from "lucide-react";

interface ProductionSectionProps {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const ProductionSection: React.FC<ProductionSectionProps> = ({
  title,
  items,
  icon: Icon,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <p className="font-medium">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

interface FarmProductionDetailsProps {
  farm: {
    cropsGrown: string[];
    livestockProduced: string[];
    mixedCropsGrown: string[];
    aquacultureType: string[];
    nurseryType: string[];
    poultryType: string[];
    othersType: string[];
  };
}

const FarmProductionDetails: React.FC<FarmProductionDetailsProps> = ({
  farm,
}) => {
  const sections = [
    { title: "Crops Grown", items: farm.cropsGrown, icon: Leaf },
    { title: "Livestock", items: farm.livestockProduced, icon: TractorIcon },
    { title: "Mixed Crops", items: farm.mixedCropsGrown, icon: TreeDeciduous },
    { title: "Aquaculture", items: farm.aquacultureType, icon: Fish },
    { title: "Nursery", items: farm.nurseryType, icon: Leaf },
    { title: "Poultry", items: farm.poultryType, icon: Bird },
    { title: "Others", items: farm.othersType, icon: Package },
  ];

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <ProductionSection
          key={section.title}
          title={section.title}
          items={section.items}
          icon={section.icon}
        />
      ))}
    </div>
  );
};

export default FarmProductionDetails;
