use crate::{
    domain::{device::Device, names::NameEntry, servant::OwnedServant},
    error::AppResult,
};
use serde::{Deserialize, Serialize};

/// Ports describe required behavior, not ADB/SQLite/CLI implementation details.
pub trait DeviceProvider: Send + Sync {
    fn list_devices(&self) -> AppResult<Vec<Device>>;
}
pub trait ServantRepository: Send + Sync {
    fn list_owned(&self) -> AppResult<Vec<OwnedServant>>;
}
pub trait NameCatalog: Send + Sync {
    fn list_names(&self) -> AppResult<Vec<NameEntry>>;
}
pub trait AgentProvider: Send + Sync {
    fn status(&self) -> AppResult<AgentStatus>;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatus {
    pub label: String,
    pub available: bool,
    pub detail: String,
}
