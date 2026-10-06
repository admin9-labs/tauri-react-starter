import { ArrowLeft, Clock3, FileText, Fingerprint, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { routes } from "@/app/routes";
import {
  Page,
  PageBody,
  Surface,
  SurfaceContent,
  SurfaceHeader,
} from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeText } from "@/components/ui/code-text";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";
import { EmptyState, ErrorState } from "@/components/patterns/content-state";
import { LoadingState } from "@/components/ui/content-state";
import {
  FeedbackToast,
  type FeedbackToastTone,
} from "@/components/ui/feedback-toast";
import {
  FormList,
  FormListFooter,
  FormListRow,
} from "@/components/patterns/form-list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  InspectorField,
  InspectorPanel,
  InspectorSection,
} from "@/components/patterns/inspector-panel";
import { Heading, SectionLabel, Text } from "@/components/ui/typography";
import { ExampleRecordRepository } from "@/data/repositories";
import type { ExampleRecord, ExampleRecordStatus } from "@/types/app";

type RecordDetailPageProps = {
  recordId: string;
};

type EditFormState = {
  title: string;
  summary: string;
  status: ExampleRecordStatus;
};

type DetailFeedbackToastState = {
  id: string;
  tone: FeedbackToastTone;
  message: string;
};

const RECORD_SAVED_MESSAGE = "记录已保存";

function defaultEditForm(): EditFormState {
  return {
    title: "",
    summary: "",
    status: "active",
  };
}

function mapToEditForm(record: ExampleRecord): EditFormState {
  return {
    title: record.title,
    summary: record.summary,
    status: record.status,
  };
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

function statusVariant(status: ExampleRecordStatus) {
  if (status === "active") {
    return "default" as const;
  }
  if (status === "archived") {
    return "destructive" as const;
  }
  return "m0" as const;
}

export function RecordDetailPage({ recordId }: RecordDetailPageProps) {
  const [record, setRecord] = useState<ExampleRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>(defaultEditForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<"missing" | "failed" | null>(null);
  const [feedbackToast, setFeedbackToast] =
    useState<DetailFeedbackToastState | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const repository = useMemo(() => new ExampleRecordRepository(), []);
  const activeRecord = useRef<{ id: string } | null>(null);
  const readSequence = useRef(0);

  const loadRecord = useCallback(async () => {
    const owner = activeRecord.current;
    if (owner?.id !== recordId) {
      return;
    }
    const sequence = ++readSequence.current;
    const isCurrent = () =>
      activeRecord.current === owner && readSequence.current === sequence;
    setIsLoading(true);
    try {
      const loadedRecord = await repository.findById(recordId);
      if (!isCurrent()) {
        return;
      }
      setRecord(loadedRecord);
      setLoadError(false);
      if (loadedRecord) {
        setEditForm(mapToEditForm(loadedRecord));
      }
    } catch (error) {
      if (!isCurrent()) {
        return;
      }
      console.error("Failed to load record:", error);
      setLoadError(true);
    } finally {
      if (isCurrent()) {
        setIsLoading(false);
      }
    }
  }, [recordId, repository]);

  useEffect(() => {
    activeRecord.current = { id: recordId };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRecord();
    return () => {
      activeRecord.current = null;
      readSequence.current += 1;
    };
  }, [loadRecord, recordId]);

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

  const feedbackToastId = feedbackToast?.id;
  const closeFeedbackToast = useCallback(() => {
    setFeedbackToast((current) =>
      current?.id === feedbackToastId ? null : current,
    );
  }, [feedbackToastId]);

  const handleSave = async () => {
    const owner = activeRecord.current;
    const targetId = recordId;
    if (isSaving || owner?.id !== targetId) {
      return;
    }
    if (feedbackToastId !== undefined) {
      toast.dismiss(feedbackToastId);
    }
    closeFeedbackToast();
    setIsSaving(true);
    try {
      const updated = await repository.update(targetId, editForm);
      if (activeRecord.current !== owner) {
        return;
      }
      if (!updated) {
        setSaveError("missing");
        return;
      }
      setRecord(updated);
      setSaveError(null);
      setIsEditing(false);
      showFeedbackToast("success", RECORD_SAVED_MESSAGE);
    } catch (error) {
      if (activeRecord.current !== owner) {
        return;
      }
      console.error("Failed to update record:", error);
      setSaveError("failed");
    } finally {
      if (activeRecord.current === owner) {
        setIsSaving(false);
      }
    }
  };

  const deleteRecord = async () => {
    const owner = activeRecord.current;
    const targetId = recordId;
    if (owner?.id !== targetId) {
      return;
    }
    if (feedbackToastId !== undefined) toast.dismiss(feedbackToastId);
    closeFeedbackToast();
    try {
      await repository.delete(targetId);
      if (activeRecord.current === owner) {
        window.location.hash = routes.records;
      }
    } catch (error) {
      if (activeRecord.current !== owner) {
        return;
      }
      console.error("Failed to delete record:", error);
      showFeedbackToast("error", "删除失败，请稍后重试");
    }
  };

  if (loadError) {
    return (
      <Page
        title="记录详情"
        actions={
          <Button asChild variant="toolbar" size="toolbar">
            <a href={routes.records}>
              <ArrowLeft aria-hidden="true" />
              返回列表
            </a>
          </Button>
        }
      >
        <PageBody>
          <ErrorState
            title="记录加载失败"
            description="未能读取这条记录，请重试。"
            action={
              <Button
                type="button"
                variant="outline"
                size="toolbar"
                disabled={isLoading}
                onClick={() => {
                  void loadRecord();
                }}
              >
                {isLoading ? "重试中..." : "重试"}
              </Button>
            }
          />
        </PageBody>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page title="记录详情" actions={null}>
        <PageBody>
          <LoadingState className="min-h-[34rem]" />
        </PageBody>
      </Page>
    );
  }

  if (!record) {
    return (
      <Page
        title="记录详情"
        actions={
          <Button asChild variant="toolbar" size="toolbar">
            <a href={routes.records}>
              <ArrowLeft aria-hidden="true" />
              返回列表
            </a>
          </Button>
        }
      >
        <PageBody>
          <EmptyState
            title="记录不存在"
            description="该示例记录可能已被删除，或当前数据库尚未写入示例数据。"
            className="min-h-[34rem]"
            action={
              <Button asChild variant="outline" size="toolbar">
                <a href={routes.records}>返回列表</a>
              </Button>
            }
          />
        </PageBody>
      </Page>
    );
  }

  return (
    <Page
      title="记录详情"
      actions={
        <Button asChild variant="toolbar" size="toolbar">
          <a href={routes.records}>
            <ArrowLeft aria-hidden="true" />
            返回列表
          </a>
        </Button>
      }
    >
      <PageBody>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Surface className="overflow-hidden">
            <SurfaceHeader variant="toolbar">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <Heading level={2} variant="display" className="truncate">
                    {isEditing ? "编辑记录" : record.title}
                  </Heading>
                  <Badge variant={statusVariant(record.status)}>
                    {statusLabel(record.status)}
                  </Badge>
                </div>
              </div>
            </SurfaceHeader>

            <SurfaceContent>
              {isEditing ? (
                <FormList>
                  <FormListRow>
                    <Label htmlFor="title" className="text-label">
                      标题
                    </Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(event) => {
                        setEditForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }));
                      }}
                    />
                  </FormListRow>

                  <FormListRow align="start">
                    <Label htmlFor="summary" className="pt-3 text-label">
                      摘要
                    </Label>
                    <Textarea
                      id="summary"
                      value={editForm.summary}
                      onChange={(event) => {
                        setEditForm((current) => ({
                          ...current,
                          summary: event.target.value,
                        }));
                      }}
                    />
                  </FormListRow>

                  <FormListRow>
                    <Label htmlFor="status" className="text-label">
                      状态
                    </Label>
                    <NativeSelect
                      id="status"
                      value={editForm.status}
                      onChange={(event) => {
                        setEditForm((current) => ({
                          ...current,
                          status: event.target.value as ExampleRecordStatus,
                        }));
                      }}
                    >
                      <option value="active">启用</option>
                      <option value="paused">暂停</option>
                      <option value="archived">归档</option>
                    </NativeSelect>
                  </FormListRow>

                  {saveError ? (
                    <ErrorState
                      title={
                        saveError === "missing"
                          ? "记录已不存在，此次未保存"
                          : "保存失败"
                      }
                      description={
                        saveError === "missing"
                          ? "编辑内容已保留，可复制后返回列表。"
                          : "编辑内容已保留，请重试保存。"
                      }
                      className="m-4"
                      action={
                        <Button asChild variant="outline" size="toolbar">
                          <a href={routes.records}>返回列表</a>
                        </Button>
                      }
                    />
                  ) : null}

                  <FormListFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      size="toolbar"
                      disabled={isSaving}
                      onClick={() => {
                        setEditForm(mapToEditForm(record));
                        setSaveError(null);
                        setIsEditing(false);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="button"
                      size="toolbar"
                      disabled={isSaving}
                      onClick={() => {
                        void handleSave();
                      }}
                    >
                      <Save aria-hidden="true" />
                      {isSaving ? "保存中..." : "保存"}
                    </Button>
                  </FormListFooter>
                </FormList>
              ) : (
                <div className="space-y-5">
                  <div className="ui-surface-muted p-5">
                    <SectionLabel className="mb-3 flex items-center gap-2">
                      <FileText
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      Summary
                    </SectionLabel>
                    <Text>{record.summary}</Text>
                  </div>

                  <div className="grid gap-2">
                    {[
                      ["标题", record.title],
                      ["状态", statusLabel(record.status)],
                      [
                        "创建时间",
                        new Date(record.createdAt).toLocaleString("zh-CN"),
                      ],
                      [
                        "更新时间",
                        new Date(record.updatedAt).toLocaleString("zh-CN"),
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[7rem_minmax(0,1fr)] items-center border-b border-separator py-3 last:border-b-0"
                      >
                        <Text as="span" variant="label">
                          {label}
                        </Text>
                        <Text as="span" className="truncate">
                          {value}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SurfaceContent>
          </Surface>

          <InspectorPanel
            title="Inspector"
            variant="floating"
            footer={
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="toolbar"
                  disabled={isEditing}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  编辑记录
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="toolbar"
                  disabled={isEditing}
                  onClick={() => {
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  删除记录
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <InspectorSection title="Identity">
                <InspectorField
                  label={
                    <span className="inline-flex items-center gap-1.5">
                      <Fingerprint className="size-3.5" aria-hidden="true" />
                      ID
                    </span>
                  }
                  value={<CodeText>{record.id}</CodeText>}
                />
                <InspectorField
                  label="状态"
                  value={statusLabel(record.status)}
                />
              </InspectorSection>
              <InspectorSection title="Timeline">
                <InspectorField
                  label="创建"
                  value={new Date(record.createdAt).toLocaleString("zh-CN")}
                />
                <InspectorField
                  label={
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      更新
                    </span>
                  }
                  value={new Date(record.updatedAt).toLocaleString("zh-CN")}
                />
              </InspectorSection>
            </div>
          </InspectorPanel>
        </div>
      </PageBody>

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="删除记录"
        description={`确定要删除记录 ${record.title} 吗？该操作不可撤销。`}
        confirmLabel="删除"
        cancelLabel="取消"
        tone="destructive"
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
        }}
        onConfirm={() => {
          void deleteRecord();
        }}
      />

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
