use crate::{
    domain::{
        device::Device,
        names::{find_candidates, MatchKind, NameEntry},
        servant::OwnedServant,
    },
    error::{AppError, AppResult},
    ports::{AgentProvider, AgentStatus, DeviceProvider, NameCatalog, ServantRepository},
};
use serde::Serialize;
use std::sync::Arc;

pub const PROTOCOL_VERSION: u8 = 1;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceSnapshot {
    pub protocol_version: u8,
    pub mode: RuntimeMode,
    pub devices: Vec<Device>,
    pub servants: Vec<OwnedServant>,
    pub agent: AgentStatus,
}

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum RuntimeMode {
    Demo,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NameSearch {
    pub protocol_version: u8,
    pub query: String,
    pub match_kind: MatchKind,
    pub candidates: Vec<NameEntry>,
}

pub struct Application {
    devices: Arc<dyn DeviceProvider>,
    servants: Arc<dyn ServantRepository>,
    names: Arc<dyn NameCatalog>,
    agent: Arc<dyn AgentProvider>,
    mode: RuntimeMode,
}

impl Application {
    pub fn new(
        devices: Arc<dyn DeviceProvider>,
        servants: Arc<dyn ServantRepository>,
        names: Arc<dyn NameCatalog>,
        agent: Arc<dyn AgentProvider>,
        mode: RuntimeMode,
    ) -> Self {
        Self {
            devices,
            servants,
            names,
            agent,
            mode,
        }
    }

    pub fn load_workspace(&self) -> AppResult<WorkspaceSnapshot> {
        Ok(WorkspaceSnapshot {
            protocol_version: PROTOCOL_VERSION,
            mode: self.mode,
            devices: self.devices.list_devices()?,
            servants: self.servants.list_owned()?,
            agent: self.agent.status()?,
        })
    }

    pub fn search_names(&self, query: String) -> AppResult<NameSearch> {
        if query.chars().count() > 200 {
            return Err(AppError::new("invalid_query", "名称查询不得超过 200 字符"));
        }
        let (match_kind, candidates) = find_candidates(&query, &self.names.list_names()?);
        Ok(NameSearch {
            protocol_version: PROTOCOL_VERSION,
            query,
            match_kind,
            candidates,
        })
    }
}
