use fgo_core::{
    application::{Application, NameSearch, WorkspaceSnapshot},
    error::{AppError, AppResult},
};
use std::sync::Arc;

// Keep blocking adapters off the UI thread; command handlers contain no business rules.
#[tauri::command]
pub async fn load_workspace(
    state: tauri::State<'_, Arc<Application>>,
) -> AppResult<WorkspaceSnapshot> {
    let application = Arc::clone(state.inner());
    tauri::async_runtime::spawn_blocking(move || application.load_workspace())
        .await
        .map_err(|_| AppError::new("task_failed", "工作区任务异常，请重试"))?
}

#[tauri::command]
pub async fn search_names(
    query: String,
    state: tauri::State<'_, Arc<Application>>,
) -> AppResult<NameSearch> {
    let application = Arc::clone(state.inner());
    tauri::async_runtime::spawn_blocking(move || application.search_names(query))
        .await
        .map_err(|_| AppError::new("task_failed", "名称查询任务异常，请重试"))?
}
