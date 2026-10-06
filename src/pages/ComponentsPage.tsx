import {
  Bell,
  CheckCircle2,
  Copy,
  Database,
  FileText,
  Filter,
  Info,
  Layers3,
  Lock,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  Page,
  PageBody,
  Surface,
  SurfaceContent,
  SurfaceHeader,
} from "@/components/layout/page";
import { ActionIcon } from "@/components/ui/action-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeText } from "@/components/ui/code-text";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";
import { EmptyState } from "@/components/patterns/content-state";
import { LoadingState } from "@/components/ui/content-state";
import { FeedbackToast } from "@/components/ui/feedback-toast";
import {
  GroupedList,
  GroupedListRow,
} from "@/components/patterns/grouped-list";
import {
  InspectorField,
  InspectorPanel,
  InspectorSection,
} from "@/components/patterns/inspector-panel";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SourceList, SourceListItem } from "@/components/patterns/source-list";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableColumnGroup,
  TableContainer,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { Heading, MutedText, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type DensityValue = "compact" | "regular" | "wide";

type LabSectionProps = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

function LabSection({ title, meta, children, className }: LabSectionProps) {
  return (
    <Surface className={className}>
      <SurfaceHeader className="flex min-h-12 items-center justify-between gap-4">
        <Heading level={2} variant="title">
          {title}
        </Heading>
        {meta ? (
          <Text
            as="div"
            variant="meta"
            className="flex min-w-0 items-center gap-2"
          >
            {meta}
          </Text>
        ) : null}
      </SurfaceHeader>
      <SurfaceContent>{children}</SurfaceContent>
    </Surface>
  );
}

const tableRows = [
  {
    name: "Primary record",
    type: "Example",
    status: "Synced",
    owner: "Local",
  },
  {
    name: "API registration",
    type: "Workflow",
    status: "Review",
    owner: "Template",
  },
  {
    name: "Recovery note",
    type: "Memo",
    status: "Locked",
    owner: "Private",
  },
];

const densityClassName: Record<DensityValue, string> = {
  compact: "gap-3",
  regular: "gap-5",
  wide: "gap-7",
};

const densityLabel: Record<DensityValue, string> = {
  compact: "紧凑",
  regular: "常规",
  wide: "宽松",
};

export function ComponentsPage() {
  const [density, setDensity] = useState<DensityValue>("regular");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const feedbackToastId = feedbackToast?.id;
  const closeFeedbackToast = useCallback(() => {
    setFeedbackToast((current) =>
      current?.id === feedbackToastId ? null : current,
    );
  }, [feedbackToastId]);
  const showFeedbackToast = (message: string) => {
    if (feedbackToastId !== undefined) toast.dismiss(feedbackToastId);
    setFeedbackToast({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
    });
  };

  return (
    <Page
      title="组件"
      actions={
        <>
          <Button
            type="button"
            variant="toolbar"
            size="toolbar"
            onClick={() => {
              showFeedbackToast("UI Lab 已刷新");
            }}
          >
            <Bell className="size-3.5" aria-hidden="true" />
            触发提示
          </Button>
          <Button
            type="button"
            size="toolbar"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            打开弹窗
          </Button>
        </>
      }
    >
      <PageBody>
        <div className={cn("grid", densityClassName[density])}>
          <Surface variant="overview" className="overflow-hidden">
            <SurfaceContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="px-5 py-5">
                <Badge variant="m0">UI Lab</Badge>
                <Heading level={1} variant="headline" className="mt-4">
                  项目内组件样板
                </Heading>
                <MutedText className="mt-3 max-w-2xl">
                  在真实 AppShell、主题 token 和路由中观察高频控件、弹层、
                  表单状态与数据布局。
                </MutedText>
              </div>
              <div className="ui-surface-split-muted border-t border-separator p-5 lg:border-l lg:border-t-0">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <MutedText as="span">Density</MutedText>
                    <SegmentedControl
                      ariaLabel="组件密度"
                      value={density}
                      onValueChange={setDensity}
                      className="w-full justify-between"
                      options={[
                        { label: "紧凑", value: "compact" },
                        { label: "常规", value: "regular" },
                        { label: "宽松", value: "wide" },
                      ]}
                    />
                  </div>
                  <div className="ui-surface-capsule flex items-center justify-between gap-3 px-4 py-3">
                    <MutedText as="span">快捷入口</MutedText>
                    <span className="flex items-center gap-1">
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                    </span>
                  </div>
                </div>
              </div>
            </SurfaceContent>
          </Surface>

          <div
            className={cn(
              "grid xl:grid-cols-[minmax(0,1fr)_22rem]",
              densityClassName[density],
            )}
          >
            <div className={cn("grid", densityClassName[density])}>
              <LabSection
                title="按钮与标记"
                meta={<Badge variant="outline">Controls</Badge>}
              >
                <div className="grid gap-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button>
                      <Plus className="size-3.5" aria-hidden="true" />
                      新建
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="size-3.5" aria-hidden="true" />
                      同步
                    </Button>
                    <Button variant="secondary">次要操作</Button>
                    <Button variant="ghost">静默操作</Button>
                    <Button variant="destructive">
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      删除
                    </Button>
                    <Button variant="link">文本链接</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tooltip content="复制标识">
                      <ActionIcon aria-label="复制标识" variant="default">
                        <Copy className="size-4" aria-hidden="true" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip content="筛选记录">
                      <ActionIcon aria-label="筛选记录">
                        <Filter className="size-4" aria-hidden="true" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip content="更多操作">
                      <ActionIcon aria-label="更多操作">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </ActionIcon>
                    </Tooltip>
                    <ActionIcon aria-label="危险操作" variant="destructive">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </ActionIcon>
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Danger</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="m0">M0</Badge>
                  </div>
                </div>
              </LabSection>

              <LabSection
                title="表单"
                meta={<span>{densityLabel[density]}</span>}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lab-title">标题</Label>
                    <Input id="lab-title" defaultValue="Example record" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lab-type">类型</Label>
                    <NativeSelect id="lab-type" defaultValue="record">
                      <option value="record">Record</option>
                      <option value="workflow">Workflow</option>
                      <option value="memo">Memo</option>
                    </NativeSelect>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="lab-search">搜索</Label>
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-disabled"
                        aria-hidden="true"
                      />
                      <Input
                        id="lab-search"
                        className="pl-8"
                        placeholder="搜索记录、状态或来源"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="lab-note">备注</Label>
                    <Textarea
                      id="lab-note"
                      resize="none"
                      defaultValue={"scope: local\nstate: verified"}
                    />
                  </div>
                </div>
              </LabSection>

              <LabSection
                title="表格"
                meta={<Badge variant="secondary">Data</Badge>}
              >
                <div className="ui-surface-card h-56 overflow-hidden">
                  <TableContainer>
                    <TableRoot>
                      <TableColumnGroup>
                        <TableColumn className="w-[36%]" />
                        <TableColumn className="w-[22%]" />
                        <TableColumn className="w-[22%]" />
                        <TableColumn />
                      </TableColumnGroup>
                      <TableHeader>
                        <TableRow>
                          <TableHead>名称</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>归属</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableRows.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell className="font-normal text-foreground">
                              {row.name}
                            </TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  row.status === "Locked"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.owner}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableRoot>
                  </TableContainer>
                </div>
              </LabSection>

              <LabSection title="状态">
                <div className="grid gap-4 md:grid-cols-2">
                  <LoadingState
                    className="ui-surface-muted min-h-44"
                    message="正在同步组件状态..."
                  />
                  <EmptyState
                    className="min-h-44"
                    title="暂无匹配组件"
                    description="筛选条件下没有可展示的条目。"
                    action={
                      <Button type="button" variant="outline" size="toolbar">
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                        重置筛选
                      </Button>
                    }
                  />
                </div>
              </LabSection>
            </div>

            <div className={cn("grid", densityClassName[density])}>
              <GroupedList title="常见布局">
                <GroupedListRow
                  icon={<Layers3 className="size-4" aria-hidden="true" />}
                  title="三栏工作区"
                  description="Source list, table, inspector"
                  meta={<Badge variant="m0">Layout</Badge>}
                />
                <GroupedListRow
                  icon={<FileText className="size-4" aria-hidden="true" />}
                  title="详情表单"
                  description="Edit, confirm, feedback"
                  meta={<Badge variant="m0">Form</Badge>}
                />
                <GroupedListRow
                  icon={<ShieldAlert className="size-4" aria-hidden="true" />}
                  title="危险操作"
                  description="ConfirmDialog + destructive action"
                  action={
                    <Button
                      type="button"
                      size="toolbar"
                      variant="destructive"
                      onClick={() => {
                        setIsConfirmOpen(true);
                      }}
                    >
                      验证
                    </Button>
                  }
                />
              </GroupedList>

              <Surface className="overflow-hidden">
                <SurfaceHeader>
                  <Heading level={2} variant="title">
                    Source List
                  </Heading>
                </SurfaceHeader>
                <SurfaceContent>
                  <SourceList title="Records">
                    <SourceListItem
                      label="全部记录"
                      count={12}
                      icon={
                        <Database className="size-3.5" aria-hidden="true" />
                      }
                      active
                    />
                    <SourceListItem
                      label="已锁定"
                      count={4}
                      icon={<Lock className="size-3.5" aria-hidden="true" />}
                    />
                    <SourceListItem
                      label="待检查"
                      count={2}
                      icon={<Info className="size-3.5" aria-hidden="true" />}
                    />
                  </SourceList>
                </SurfaceContent>
              </Surface>

              <InspectorPanel
                title="Inspector"
                variant="floating"
                className="min-h-[28rem]"
                footer={
                  <Button
                    type="button"
                    className="w-full"
                    size="toolbar"
                    onClick={() => {
                      showFeedbackToast("检查完成");
                    }}
                  >
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    标记完成
                  </Button>
                }
              >
                <InspectorSection title="Metadata">
                  <InspectorField
                    label="Route"
                    value={<CodeText>#/components</CodeText>}
                  />
                  <InspectorField label="Shell" value="AppShell" />
                  <InspectorField label="Theme" value="Token driven" />
                </InspectorSection>
                <InspectorSection title="Coverage" className="mt-4">
                  <InspectorField label="Controls" value="Button, ActionIcon" />
                  <InspectorField
                    label="Forms"
                    value="Input, Select, Textarea"
                  />
                  <InspectorField
                    label="Feedback"
                    value="Modal, Toast, State"
                  />
                </InspectorSection>
              </InspectorPanel>
            </div>
          </div>
        </div>
      </PageBody>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="组件弹窗"
        size="lg"
        closeButtonProps={{
          "aria-label": "关闭组件弹窗",
        }}
      >
        <div className="grid gap-4">
          <MutedText>
            Modal 使用项目自有 primitive，保留真实焦点、遮罩和关闭行为。
          </MutedText>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="toolbar"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              关闭
            </Button>
            <Button
              type="button"
              size="toolbar"
              onClick={() => {
                setIsModalOpen(false);
                showFeedbackToast("弹窗已确认");
              }}
            >
              确认
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={isConfirmOpen}
        title="确认危险操作"
        description="这只是 UI Lab 的确认流程，不会修改任何数据。"
        confirmLabel="确认"
        tone="destructive"
        onCancel={() => {
          setIsConfirmOpen(false);
        }}
        onConfirm={() => {
          setIsConfirmOpen(false);
          showFeedbackToast("确认流程完成");
        }}
      />

      {feedbackToast ? (
        <FeedbackToast
          id={feedbackToast.id}
          tone="success"
          message={feedbackToast.message}
          onClose={closeFeedbackToast}
        />
      ) : null}
    </Page>
  );
}
