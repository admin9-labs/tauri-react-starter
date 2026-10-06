import {
  ChevronRight,
  Database,
  Gauge,
  Layers3,
  Palette,
  TestTube2,
} from "lucide-react";

import {
  Page,
  PageBody,
  Surface,
  SurfaceContent,
} from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GroupedList,
  GroupedListRow,
} from "@/components/patterns/grouped-list";
import {
  Heading,
  MutedText,
  SectionLabel,
  Text,
} from "@/components/ui/typography";
import { routes } from "@/app/routes";

const capabilities = [
  {
    group: "Workspace",
    title: "Native shell",
    description: "Tauri window lifecycle, sidebar, toolbar, dialogs.",
    icon: Layers3,
    meta: "Tauri 2",
  },
  {
    group: "Data",
    title: "SQLite data",
    description: "Migrations, repository layer, browser-safe test mock.",
    icon: Database,
    meta: "Repository",
  },
  {
    group: "Interface",
    title: "Owned UI kit",
    description: "Radix primitives, Tailwind tokens, lucide controls.",
    icon: Palette,
    meta: "shadcn",
  },
  {
    group: "Quality",
    title: "Quality gates",
    description: "Vitest, Testing Library, Playwright, lint, typecheck.",
    icon: TestTube2,
    meta: "Verified",
  },
];

export function DashboardPage() {
  return (
    <Page
      title="概览"
      actions={
        <Button asChild variant="toolbar" size="toolbar">
          <a href={routes.records}>查看记录</a>
        </Button>
      }
    >
      <PageBody>
        <div className="mx-auto grid max-w-5xl gap-5">
          <Surface variant="overview" className="overflow-hidden">
            <SurfaceContent className="grid gap-0 p-0 md:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="min-w-0 px-6 py-6">
                <Badge variant="m0">Tauri React SQLite Starter</Badge>
                <Heading level={2} variant="headline" className="mt-5">
                  干净的本地桌面工具骨架
                </Heading>
                <MutedText className="mt-4 max-w-2xl">
                  用原生应用的结构承载开发者工具：稳定侧边栏、紧凑工具栏、
                  分组列表、inspector，以及可换主题 token。
                </MutedText>
              </div>

              <div className="ui-surface-split-muted border-t border-separator p-5 md:border-l md:border-t-0">
                <div className="flex h-full flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <SectionLabel>Desktop baseline</SectionLabel>
                    <Text variant="bodyStrong">
                      Finder + Settings + TablePlus
                    </Text>
                    <Text variant="caption">面向开发者工具的原生骨架。</Text>
                  </div>
                  <Button asChild className="w-full" size="toolbar">
                    <a href={routes.records}>
                      <Database aria-hidden="true" />
                      打开记录
                    </a>
                  </Button>
                </div>
              </div>
            </SurfaceContent>
          </Surface>

          <GroupedList title="Starter groups">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <GroupedListRow
                  key={item.title}
                  icon={<Icon className="size-4" aria-hidden="true" />}
                  title={item.group}
                  description={`${item.title} · ${item.description}`}
                  meta={
                    <>
                      <span>{item.meta}</span>
                      <ChevronRight className="size-3.5" aria-hidden="true" />
                    </>
                  }
                />
              );
            })}
          </GroupedList>

          <Surface variant="overview" className="overflow-hidden">
            <SurfaceContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="ui-icon-tile size-10">
                  <Gauge className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <Text variant="bodyStrong">Ready for customization</Text>
                  <Text variant="caption" className="truncate">
                    替换业务模块时保留 shell、token、数据层和测试基线。
                  </Text>
                </div>
              </div>
              <Button asChild variant="outline" size="toolbar">
                <a href={routes.records}>查看示例数据</a>
              </Button>
            </SurfaceContent>
          </Surface>
        </div>
      </PageBody>
    </Page>
  );
}
