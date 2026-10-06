import { ChartsPage } from "@/pages/ChartsPage";
import { BaseLayout } from "./BaseLayout";
import { AppProviders } from "./compositionRoot/providers";

export function App() {
  return (
    <AppProviders>
      <BaseLayout>
        <ChartsPage />
      </BaseLayout>
    </AppProviders>
  );
}
