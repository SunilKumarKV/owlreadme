"use client";

import useRoadmapStore from '@/stores/roadmap-store';
import useThemeStore from '@/stores/theme-store';

import { useNotifications } from './hooks/useNotifications';
import { useDialogState } from './hooks/useDialogState';
import { useLoadingState } from './hooks/useLoadingState';
import { useDashboardNavigation } from './hooks/useDashboardNavigation';
import { useWorkspaceActions } from './hooks/useWorkspaceActions';
import { useGithubProfile } from './hooks/useGithubProfile';
import { useRepositoryAnalysis } from './hooks/useRepositoryAnalysis';
import { useOwlAI } from './hooks/useOwlAI';

import { GithubProfilePanel } from './components/GithubProfilePanel';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { ProjectWorkspacesPanel } from './components/ProjectWorkspacesPanel';
import { RepositoryInsightsPanel } from './components/RepositoryInsightsPanel';
import { OwlAIAssistantPanel } from './components/OwlAIAssistantPanel';
import { WorkspaceConfigurationsPanel } from './components/WorkspaceConfigurationsPanel';
import { WorkspaceStatisticsPanel } from './components/WorkspaceStatisticsPanel';
import { WorkspaceDialogs } from './components/WorkspaceDialogs';
import { NotificationOverlay } from './components/NotificationOverlay';

const DeveloperDashboardPage = () => {
  // 1. Core local states via granular hooks
  const { notification, addNotification } = useNotifications();
  const dialogState = useDialogState();
  const loadingState = useLoadingState();

  // 2. State & actions for workspaces
  const workspaceActions = useWorkspaceActions({
    addNotification,
    setIsCreateModalOpen: dialogState.setIsCreateModalOpen,
    setEditingWorkspaceId: dialogState.setEditingWorkspaceId,
    setConfirmDeleteId: dialogState.setConfirmDeleteId,
    setNewProjectName: dialogState.setNewProjectName,
    newProjectName: dialogState.newProjectName,
    newProjectType: dialogState.newProjectType,
    editingName: dialogState.editingName,
  });

  const { isReadmeType, isRoadmapType } = workspaceActions;

  // 3. Navigation/tab logic
  const { username, aiTab, setAiTab } = useDashboardNavigation(isReadmeType, isRoadmapType);

  // 4. Github profile loading logic
  const {
    readmeName,
    readmeRole,
    readmeAbout,
    avatarUrl,
    followers,
    publicRepos,
    repoAnalysis,
    readmeState,
  } = useGithubProfile({
    username,
    setLoading: loadingState.setLoading,
    setError: loadingState.setError,
  });

  // 5. Repository analysis action
  const { applySuggestedSkills, applySuggestedProjects } = useRepositoryAnalysis({
    addNotification,
    repoAnalysis,
  });

  // 6. Owl AI operations
  const roadmapState = useRoadmapStore();
  const { theme, templatesUsedCount: themeTemplatesCount } = useThemeStore();

  const {
    aiSuggestions,
    handleConsultOwlAI,
    applyIntro,
    applyAboutMe,
    applySkills,
    applyProjects,
    applyRoadmapSteps,
    applyProfileBio,
    applyPortfolioDescription,
  } = useOwlAI({
    readmeState,
    roadmapState,
    setAiLoading: loadingState.setAiLoading,
    setError: loadingState.setError,
    addNotification,
  });

  // Compute total templates count
  const totalTemplatesCount =
    (readmeState.templatesUsedCount || 0) +
    (roadmapState.templatesUsedCount || 0) +
    themeTemplatesCount;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-[#1e1e1e] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center lg:text-left">Developer Workspace</h1>

        {loadingState.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span>{loadingState.error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Quick Actions */}
          <div className="space-y-8 lg:col-span-1">
            {isReadmeType && (
              <GithubProfilePanel
                loading={loadingState.loading}
                avatarUrl={avatarUrl}
                readmeName={readmeName}
                readmeRole={readmeRole}
                readmeAbout={readmeAbout}
                followers={followers}
                publicRepos={publicRepos}
              />
            )}

            <QuickActionsPanel
              isReadmeType={isReadmeType}
              isRoadmapType={isRoadmapType}
            />
          </div>

          {/* Right Column: Projects, Templates, Statistics */}
          <div className="space-y-8 lg:col-span-2">
            <ProjectWorkspacesPanel
              workspaces={workspaceActions.workspaces}
              activeWorkspaceId={workspaceActions.activeWorkspaceId}
              editingWorkspaceId={dialogState.editingWorkspaceId}
              setEditingWorkspaceId={dialogState.setEditingWorkspaceId}
              editingName={dialogState.editingName}
              setEditingName={dialogState.setEditingName}
              confirmDeleteId={dialogState.confirmDeleteId}
              setConfirmDeleteId={dialogState.setConfirmDeleteId}
              handleRenameSave={workspaceActions.handleRenameSave}
              handleDeleteWorkspace={workspaceActions.handleDeleteWorkspace}
              handleDuplicateWorkspace={workspaceActions.handleDuplicateWorkspace}
              handleLoadWorkspace={workspaceActions.handleLoadWorkspace}
              setIsCreateModalOpen={dialogState.setIsCreateModalOpen}
            />

            <RepositoryInsightsPanel
              repoAnalysis={repoAnalysis}
              applySuggestedSkills={applySuggestedSkills}
              applySuggestedProjects={applySuggestedProjects}
            />

            <OwlAIAssistantPanel
              isReadmeType={isReadmeType}
              isRoadmapType={isRoadmapType}
              repoAnalysis={repoAnalysis}
              aiLoading={loadingState.aiLoading}
              aiSuggestions={aiSuggestions}
              aiTab={aiTab}
              setAiTab={setAiTab}
              handleConsultOwlAI={handleConsultOwlAI}
              applyIntro={applyIntro}
              applyAboutMe={applyAboutMe}
              applySkills={applySkills}
              applyProjects={applyProjects}
              applyRoadmapSteps={applyRoadmapSteps}
              applyProfileBio={applyProfileBio}
              applyPortfolioDescription={applyPortfolioDescription}
            />

            <WorkspaceConfigurationsPanel
              isReadmeType={isReadmeType}
              isRoadmapType={isRoadmapType}
              readmeTemplate={readmeState.template || 'minimal'}
              roadmapTemplate={roadmapState.template}
              theme={theme}
            />

            <WorkspaceStatisticsPanel
              isReadmeType={isReadmeType}
              isRoadmapType={isRoadmapType}
              readmeExportsCount={readmeState.readmeExportsCount || 0}
              roadmapExportsCount={roadmapState.roadmapExportsCount || 0}
              totalTemplatesCount={totalTemplatesCount}
            />
          </div>
        </div>
      </div>

      <WorkspaceDialogs
        isCreateModalOpen={dialogState.isCreateModalOpen}
        setIsCreateModalOpen={dialogState.setIsCreateModalOpen}
        newProjectName={dialogState.newProjectName}
        setNewProjectName={dialogState.setNewProjectName}
        newProjectType={dialogState.newProjectType}
        setNewProjectType={dialogState.setNewProjectType}
        handleCreateWorkspace={workspaceActions.handleCreateWorkspace}
      />

      <NotificationOverlay notification={notification} />
    </div>
  );
};

export default DeveloperDashboardPage;
