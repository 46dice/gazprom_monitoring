import { IconArrowBackUp } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import { useDi } from "./di";

export function ResetChartFeature() {
  const { resetChart, isPreset } = useDi();
  const label = isPreset ? "Вернуть исходные настройки" : "Очистить оси";

  return (
    <Button variant="ghost" size="icon-sm" onClick={resetChart} aria-label={label} title={label}>
      <IconArrowBackUp />
    </Button>
  );
}
