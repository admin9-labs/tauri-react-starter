import {
  ChevronRight,
  Circle,
  Clock3,
  Database,
  FileText,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { routes } from "@/app/routes";
import {
  Page,
  PageBody,
  Surface,
  SurfaceContent,
} from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { CodeText } from "@/components/ui/code-text";
import { EmptyState, ErrorState } from "@/components/patterns/content-state";
import { LoadingState } from "@/components/ui/content-state";
import {
  FeedbackToast,
  type FeedbackToastTone,
} from "@/components/ui/feedback-toast";
import {
  InspectorField,
  InspectorPanel,
  InspectorSection,
} from "@/components/patterns/inspector-panel";
import {
  RecordListFooter,
  RecordListHeader,
  RecordListItem,
} from "@/components/patterns/record-list";
import { SourceList, SourceListItem } from "@/components/patterns/source-list";
import { MetaText, Text } from "@/components/ui/typography";
import { ExampleRecordRepository } from "@/data/repositories";
import type { ExampleRecord, ExampleRecordStatus } from "@/types/app";

const LIST_REFRESH_MIN_LOADING_MS = 260;
type RecordFilter = "all" | ExampleRecordStatus;

type FeedbackToastState = {
  id: string;
  tone: FeedbackToastTone;
  message: string;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: ExampleRecordStatus) {
  if (status === "paused") {
    return "暂停";
  }
  if (status === "archived") {
    return "归档";
  }
  return "启用";
}

function sourceLabel(filter: RecordFilter) {
  if (filter === "active") {
    return "启用中";
  }
  if (filter === "paused") {
    return "暂停";
  }
  if (filter === "archived") {
    return "归档";
  }
  return "全部记录";
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("zh-CN");
}

function getSelectedRecord(
  records: ExampleRecord[],
  selectedRecordId: string | null,
): ExampleRecord | null {
  if (records.length === 0) {
    return null;
  }

  return records.find((record) => record.id === selectedRecordId) ?? records[0];
}

export function RecordsPage() {
  const [records, setRecords] = useState<ExampleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecordFilter>("all");
  const [feedbackToast, setFeedbackToast] = useState<FeedbackToastState | null>(
    null,
  );

  const repository = useMemo(() => new ExampleRecordRepository(), []);

  const showFeedbackToast = useCallback(
    (tone: FeedbackToastTone, message: string) => {
      setFeedbackToast({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        tone,
        message,
      });
    },
    [],
  );

  const lifetime = useRef<object | null>(null);
  const readSequence = useRef(0);

  const loadRecords = useCallback(
    async (mode: "loading" | "refreshing" = "loading") => {
      const owner = lifetime.current;
      if (!owner) return;
      const sequence = ++readSequence.current;
      const isCurrent = () =>
        lifetime.current === owner && readSequence.current === sequence;
      const startedAt = Date.now();
      if (mode === "refreshing") setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const result = await repository.findAll();
        if (!isCurrent()) return;
        setRecords(result);
        setHasLoaded(true);
        setLoadError(false);
        setSelectedRecordId((current) =>
          result.some((item) => item.id === current)
            ? current
            : (result[0]?.id ?? null),
        );
      } catch (error) {
        if (!isCurrent()) return;
        console.error("Failed to load records:", error);
        setLoadError(true);
      } finally {
        if (mode === "refreshing" && isCurrent()) {
          const remaining =
            LIST_REFRESH_MIN_LOADING_MS - (Date.now() - startedAt);
          if (remaining > 0) {
            await new Promise<void>((resolve) =>
              window.setTimeout(resolve, remaining),
            );
          }
        }
        if (isCurrent()) {
          if (mode === "refreshing") setIsRefreshing(false);
          else setIsLoading(false);
        }
      }
    },
    [repository],
  );

  useEffect(() => {
    lifetime.current = {};
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRecords();
    return () => {
      lifetime.current = null;
      readSequence.current += 1;
    };
  }, [loadRecords]);

  const feedbackToastId = feedbackToast?.id;
  const closeFeedbackToast = useCallback(() => {
    setFeedbackToast((current) =>
      current?.id === feedbackToastId ? null : current,
    );
  }, [feedbackToastId]);

  const seedRecords = async () => {
    if (isLoading || isRefreshing) {
      return;
    }

    const owner = lifetime.current;
    if (feedbackToastId !== undefined) toast.dismiss(feedbackToastId);
    closeFeedbackToast();
    setIsRefreshing(true);
    try {
      const seeded = await repository.seedDefaults();
      if (lifetime.current !== owner) return;
      showFeedbackToast("success", `示例记录已就绪：${seeded.length} 条`);
      await loadRecords("refreshing");
    } catch (error) {
      if (lifetime.current !== owner) return;
      console.error("Failed to seed records:", error);
      showFeedbackToast("error", "创建示例记录失败");
    } finally {
      if (lifetime.current === owner) setIsRefreshing(false);
    }
  };

  const visibleRecords = records.filter(
    (record) => activeFilter === "all" || record.status === activeFilter,
  );
  const totalCount = records.length;
  const totalLabel = `${totalCount} 条记录`;
  const visibleLabel =
    activeFilter === "all"
      ? totalLabel
      : `${visibleRecords.length} 条${sourceLabel(activeFilter)}`;
  const selectedRecord = getSelectedRecord(visibleRecords, selectedRecordId);
  const activeCount = records.filter(
    (record) => record.status === "active",
  ).length;
  const pausedCount = records.filter(
    (record) => record.status === "paused",
  ).length;
  const archivedCount = records.filter(
    (record) => record.status === "archived",
  ).length;
  const selectFilter = (filter: RecordFilter) => {
    setActiveFilter(filter);
    const nextVisibleRecords = records.filter(
      (record) => filter === "all" || record.status === filter,
    );
    setSelectedRecordId(nextVisibleRecords[0]?.id ?? null);
  };

  return (
    <Page
      title="记录"
      actions={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="toolbar"
            size="toolbar"
            disabled={isLoading || isRefreshing}
            onClick={() => {
              void loadRecords("refreshing");
            }}
          >
            <RefreshCcw aria-hidden="true" />
            {isRefreshing ? "刷新中..." : "刷新"}
          </Button>
          <Button
            type="button"
            variant="toolbar"
            size="toolbar"
            disabled={isLoading || isRefreshing}
            onClick={() => {
              void seedRecords();
            }}
          >
            <Plus aria-hidden="true" />
            生成示例
          </Button>
        </div>
      }
    >
      <PageBody maxWidth="full" className="p-0">
        <Surface
          variant="table"
          className="flex min-h-full w-full rounded-none border-0 shadow-none"
          data-record-list-surface
        >
          <SurfaceContent className="grid min-h-[calc(100dvh-3.25rem)] w-full min-w-0 grid-cols-[16rem_minmax(0,1fr)_19rem] p-0 xl:grid-cols-[17rem_minmax(0,1fr)_20rem]">
            <aside className="border-r border-separator bg-material-sidebar">
              <div className="flex h-[52px] items-center border-b border-separator px-5">
                <div className="flex items-center gap-3">
                  <div className="ui-icon-tile size-8">
                    <Database className="size-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <Text variant="bodyStrong">Example records</Text>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-4 py-5">
                <SourceList title="Smart Lists">
                  <SourceListItem
                    label="全部记录"
                    count={totalCount}
                    active={activeFilter === "all"}
                    onClick={() => {
                      selectFilter("all");
                    }}
                  />
                  <SourceListItem
                    label="启用中"
                    count={activeCount}
                    active={activeFilter === "active"}
                    onClick={() => {
                      selectFilter("active");
                    }}
                  />
                  <SourceListItem
                    label="暂停"
                    count={pausedCount}
                    active={activeFilter === "paused"}
                    onClick={() => {
                      selectFilter("paused");
                    }}
                  />
                  <SourceListItem
                    label="归档"
                    count={archivedCount}
                    active={activeFilter === "archived"}
                    onClick={() => {
                      selectFilter("archived");
                    }}
                  />
                </SourceList>
              </div>
            </aside>

            <section className="flex min-w-0 flex-col bg-material-panel">
              <div className="flex h-[52px] items-center justify-between border-b border-separator bg-material-toolbar/80 px-5 backdrop-blur-xl">
                <div className="min-w-0">
                  <Text variant="bodyStrong">{sourceLabel(activeFilter)}</Text>
                </div>
              </div>

              {loadError ? (
                <ErrorState
                  title={
                    hasLoaded ? "刷新失败，当前显示上次结果" : "记录加载失败"
                  }
                  description="未能读取记录，请重试。"
                  className="m-5"
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      size="toolbar"
                      disabled={isLoading || isRefreshing}
                      onClick={() => {
                        void loadRecords(hasLoaded ? "refreshing" : "loading");
                      }}
                    >
                      {isLoading || isRefreshing ? "重试中..." : "重试"}
                    </Button>
                  }
                />
              ) : null}

              {!hasLoaded && loadError ? null : isLoading ? (
                <LoadingState className="min-h-[34rem]" />
              ) : records.length === 0 ? (
                <EmptyState
                  title="暂无记录"
                  description="点击生成示例，查看模板的数据访问、列表和详情页骨架。"
                  className="min-h-[34rem]"
                  variant="inline"
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      size="toolbar"
                      disabled={isRefreshing}
                      onClick={() => {
                        void seedRecords();
                      }}
                    >
                      生成示例
                    </Button>
                  }
                />
              ) : visibleRecords.length === 0 ? (
                <EmptyState
                  title={`没有${sourceLabel(activeFilter)}`}
                  description="当前示例数据里没有这个状态的记录。"
                  className="min-h-[34rem]"
                  variant="inline"
                />
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto bg-background">
                  <RecordListHeader>Records</RecordListHeader>
                  <div className="divide-y divide-separator">
                    {visibleRecords.map((record) => (
                      <RecordListItem
                        key={record.id}
                        href={routes.record(record.id)}
                        active={selectedRecord?.id === record.id}
                        onFocus={() => {
                          setSelectedRecordId(record.id);
                        }}
                        onMouseEnter={() => {
                          setSelectedRecordId(record.id);
                        }}
                      >
                        <span className="min-w-0">
                          <Text
                            as="span"
                            variant="bodyStrong"
                            className="block truncate"
                          >
                            {record.title}
                          </Text>
                          <Text
                            as="span"
                            variant="caption"
                            className="mt-1 block truncate"
                          >
                            {record.summary}
                          </Text>
                        </span>
                        <MetaText
                          as="span"
                          className="flex shrink-0 flex-col items-end gap-1"
                        >
                          <span>{formatDate(record.updatedAt)}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Circle
                              className="size-2 fill-primary text-primary"
                              aria-hidden="true"
                            />
                            {statusLabel(record.status)}
                          </span>
                        </MetaText>
                      </RecordListItem>
                    ))}
                  </div>
                  <RecordListFooter>{visibleLabel}</RecordListFooter>
                </div>
              )}
            </section>

            <InspectorPanel
              title="Record Inspector"
              footer={
                selectedRecord ? (
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                    size="toolbar"
                  >
                    <a href={routes.record(selectedRecord.id)}>
                      打开详情
                      <ChevronRight aria-hidden="true" />
                    </a>
                  </Button>
                ) : null
              }
            >
              {selectedRecord ? (
                <div className="space-y-4">
                  <InspectorSection title="Preview">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                        <Text variant="bodyStrong" className="truncate">
                          {selectedRecord.title}
                        </Text>
                      </div>
                      <Text variant="caption">{selectedRecord.summary}</Text>
                    </div>
                  </InspectorSection>

                  <InspectorSection title="Properties">
                    <InspectorField
                      label="状态"
                      value={statusLabel(selectedRecord.status)}
                    />
                    <InspectorField
                      label="更新"
                      value={formatFullDate(selectedRecord.updatedAt)}
                    />
                    <InspectorField
                      label="创建"
                      value={formatFullDate(selectedRecord.createdAt)}
                    />
                    <InspectorField
                      label="ID"
                      value={<CodeText>{selectedRecord.id}</CodeText>}
                    />
                  </InspectorSection>

                  <InspectorSection title="Activity">
                    <Text variant="caption" className="flex items-center gap-2">
                      <Clock3
                        className="size-3.5 text-label"
                        aria-hidden="true"
                      />
                      Last updated {formatDate(selectedRecord.updatedAt)}
                    </Text>
                  </InspectorSection>
                </div>
              ) : (
                <div className="space-y-4">
                  <InspectorSection title="Preview">
                    <Text variant="caption">
                      生成示例或选择记录后在这里预览详情。
                    </Text>
                  </InspectorSection>
                </div>
              )}
            </InspectorPanel>
          </SurfaceContent>
        </Surface>
      </PageBody>

      {feedbackToast ? (
        <FeedbackToast
          id={feedbackToast.id}
          tone={feedbackToast.tone}
          message={feedbackToast.message}
          onClose={closeFeedbackToast}
        />
      ) : null}
    </Page>
  );
}
