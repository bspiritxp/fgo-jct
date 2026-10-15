use fgo_core::{
    application::{Application, RuntimeMode},
    domain::{device::Device, names::NameEntry, servant::OwnedServant},
    error::{AppError, AppResult},
    ports::{AgentProvider, AgentStatus, DeviceProvider, NameCatalog, ServantRepository},
};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Deserialize)]
struct Fixture {
    devices: Vec<Device>,
    servants: Vec<OwnedServant>,
    agent: AgentStatus,
}

/// Shared fixture adapter is intentionally read-only and never contacts a device/model.
struct DemoAdapter {
    fixture: Fixture,
    names: Vec<NameEntry>,
}
impl DeviceProvider for DemoAdapter {
    fn list_devices(&self) -> AppResult<Vec<Device>> {
        Ok(self.fixture.devices.clone())
    }
}
impl ServantRepository for DemoAdapter {
    fn list_owned(&self) -> AppResult<Vec<OwnedServant>> {
        Ok(self.fixture.servants.clone())
    }
}
impl NameCatalog for DemoAdapter {
    fn list_names(&self) -> AppResult<Vec<NameEntry>> {
        Ok(self.names.clone())
    }
}
impl AgentProvider for DemoAdapter {
    fn status(&self) -> AppResult<AgentStatus> {
        Ok(self.fixture.agent.clone())
    }
}

pub fn create_application() -> AppResult<Application> {
    let invalid =
        |error: serde_json::Error| AppError::new("invalid_demo_fixture", error.to_string());
    let adapter = Arc::new(DemoAdapter {
        fixture: serde_json::from_str(include_str!("../../../tests/fixtures/demo/workspace.json"))
            .map_err(invalid)?,
        names: serde_json::from_str(include_str!("../../../tests/fixtures/demo/names.json"))
            .map_err(invalid)?,
    });
    Ok(Application::new(
        adapter.clone(),
        adapter.clone(),
        adapter.clone(),
        adapter,
        RuntimeMode::Demo,
    ))
}
