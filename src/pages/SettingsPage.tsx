import {
  Page,
  PageBody,
  Surface,
  SurfaceContent,
  SurfaceHeader,
} from "@/components/layout/page";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Heading, Text } from "@/components/ui/typography";
import { themeOptions, useTheme } from "@/app/theme";

export function SettingsPanel() {
  const { preference, resolvedTheme, setPreference } = useTheme();

  return (
    <Surface aria-labelledby="appearance-settings-title" data-settings-surface>
      <SurfaceHeader variant="muted" className="px-4 py-3">
        <Heading id="appearance-settings-title" level={2} variant="title">
          外观
        </Heading>
      </SurfaceHeader>

      <SurfaceContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1 sm:flex-1">
          <Text variant="bodyStrong">主题</Text>
          <Text variant="caption">
            当前显示为{resolvedTheme === "dark" ? "深色" : "浅色"}模式。
          </Text>
        </div>

        <SegmentedControl
          ariaLabel="主题设置"
          options={themeOptions}
          value={preference}
          className="w-full sm:w-auto"
          onValueChange={setPreference}
        />
      </SurfaceContent>
    </Surface>
  );
}

export function SettingsPage() {
  return (
    <Page title="设置">
      <PageBody maxWidth="3xl">
        <SettingsPanel />
      </PageBody>
    </Page>
  );
}
