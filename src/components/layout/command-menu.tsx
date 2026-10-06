import { Command } from "cmdk";
import {
  Component,
  LayoutDashboard,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";

import { routes } from "@/app/routes";
import { Modal } from "@/components/ui/modal";
import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/typography";

type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
};

export function CommandMenu({
  open,
  onOpenChange,
  onOpenSettings,
}: CommandMenuProps) {
  const close = () => {
    onOpenChange(false);
  };

  const navigate = (hash: string) => {
    window.location.hash = hash;
    close();
  };

  return (
    <Modal
      opened={open}
      onClose={close}
      title={
        <span className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Command Center
        </span>
      }
      size="lg"
      classNames={{
        content: "max-w-xl",
        body: "px-3 pb-3 pt-4",
      }}
      closeButtonProps={{
        "aria-label": "关闭命令面板",
      }}
    >
      <Command
        label="命令面板"
        className="ui-surface-capsule overflow-hidden bg-background"
      >
        <div className="flex h-10 items-center gap-3 border-b border-border-subtle px-4">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <Command.Input
            autoFocus
            placeholder="搜索页面和操作..."
            className="ui-type-body h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-text-disabled"
          />
          <Kbd>ESC</Kbd>
        </div>
        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="ui-type-caption px-3 py-6 text-center text-muted-foreground">
            没有匹配的命令
          </Command.Empty>
          <Command.Group
            heading="导航"
            className="[&_[cmdk-group-heading]]:ui-type-nav [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:text-text-disabled"
          >
            <Command.Item
              value="概览 dashboard"
              onSelect={() => {
                navigate(routes.dashboard);
              }}
              className="ui-command-item ui-type-caption flex min-h-10 cursor-pointer items-center gap-3 px-3 text-muted-foreground aria-selected:bg-surface-active aria-selected:text-foreground"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              <Text as="span" variant="caption">
                打开概览
              </Text>
            </Command.Item>
            <Command.Item
              value="组件 components ui"
              onSelect={() => {
                navigate(routes.components);
              }}
              className="ui-command-item ui-type-caption flex min-h-10 cursor-pointer items-center gap-3 px-3 text-muted-foreground aria-selected:bg-surface-active aria-selected:text-foreground"
            >
              <Component className="size-4" aria-hidden="true" />
              <Text as="span" variant="caption">
                打开组件
              </Text>
            </Command.Item>
          </Command.Group>
          <Command.Group
            heading="操作"
            className="[&_[cmdk-group-heading]]:ui-type-nav [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-text-disabled"
          >
            <Command.Item
              value="设置 settings theme"
              onSelect={() => {
                close();
                onOpenSettings();
              }}
              className="ui-command-item ui-type-caption flex min-h-10 cursor-pointer items-center gap-3 px-3 text-muted-foreground aria-selected:bg-surface-active aria-selected:text-foreground"
            >
              <Settings2 className="size-4" aria-hidden="true" />
              <Text as="span" variant="caption">
                打开设置
              </Text>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </Modal>
  );
}
