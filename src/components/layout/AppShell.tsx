import {
  Command as CommandIcon,
  Component,
  LayoutDashboard,
  PanelsTopLeft,
  Settings2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getRouteFromHash, routes } from "@/app/routes";
import { SettingsPanel } from "@/pages/SettingsPage";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { CommandMenu } from "@/components/layout/command-menu";
import { Modal } from "@/components/ui/modal";
import { ShellCommandButton } from "@/components/layout/shell-command-button";
import { SectionLabel, Text } from "@/components/ui/typography";

type AppShellProps = {
  activeHash: string;
  children: ReactNode;
};

export function AppShell({ activeHash, children }: AppShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [pendingActiveHash, setPendingActiveHash] = useState<{
    href: string;
    fromHash: string;
  } | null>(null);
  const visibleActiveHash =
    pendingActiveHash?.fromHash === activeHash
      ? pendingActiveHash.href
      : activeHash;
  const visibleRoute = getRouteFromHash(visibleActiveHash);
  const isDashboardActive = visibleRoute === "dashboard";
  const isComponentsActive = visibleRoute === "components";

  const closeSettingsDialog = () => {
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setPendingActiveHash(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen((current) => !current);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative flex h-dvh w-dvw overflow-hidden overscroll-none bg-window text-foreground selection:bg-primary/20 selection:text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--window-tint)]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[var(--divider)]"
        data-app-top-divider
      />
      <div className="relative flex h-full min-h-0 w-full flex-1 overflow-hidden">
        <aside className="flex w-60 shrink-0 flex-col bg-material-sidebar shadow-[var(--shadow-sidebar)] backdrop-blur-2xl">
          <div className="px-4 pb-4 pt-5">
            <div className="flex items-center gap-3 px-1 text-text-secondary">
              <div className="ui-icon-tile size-10 border border-border-subtle bg-control-fill">
                <PanelsTopLeft
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <Text as="span" variant="bodyStrong" className="block truncate">
                  Desktop Starter
                </Text>
                <SectionLabel as="span" className="block truncate">
                  Local template
                </SectionLabel>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 px-3 py-1" aria-label="主导航">
            <div className="space-y-1.5">
              <SectionLabel className="px-3 pb-1">Library</SectionLabel>
              <SidebarNavItem
                href={routes.dashboard}
                label="概览"
                icon={LayoutDashboard}
                active={isDashboardActive}
                onNavigate={(href) => {
                  setPendingActiveHash({ href, fromHash: activeHash });
                }}
              />
              <SidebarNavItem
                href={routes.components}
                label="组件"
                icon={Component}
                active={isComponentsActive}
                onNavigate={(href) => {
                  setPendingActiveHash({ href, fromHash: activeHash });
                }}
              />
            </div>
          </nav>

          <div className="space-y-1.5 px-3 pb-4 pt-2">
            <SectionLabel className="px-3 pb-1">Utilities</SectionLabel>
            <ShellCommandButton
              label="命令面板"
              icon={<CommandIcon className="size-3.5" aria-hidden="true" />}
              shortcut={["⌘", "K"]}
              onClick={() => {
                setIsCommandOpen(true);
              }}
            />
            <ShellCommandButton
              aria-label="设置"
              label="设置"
              icon={<Settings2 className="size-3.5" aria-hidden="true" />}
              meta="Tokens"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
            />
          </div>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          {children}
        </main>
      </div>

      <Modal
        opened={isSettingsOpen}
        onClose={closeSettingsDialog}
        title="设置"
        size="lg"
        closeButtonProps={{
          "aria-label": "关闭设置弹窗",
        }}
      >
        <SettingsPanel />
      </Modal>
      <CommandMenu
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onOpenSettings={() => {
          setIsSettingsOpen(true);
        }}
      />
    </div>
  );
}
