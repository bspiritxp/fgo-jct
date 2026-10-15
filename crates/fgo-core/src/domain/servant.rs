use serde::{Deserialize, Serialize};

/// IDs distinguish owned copies; a name entry is never an owned-instance key.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OwnedServant {
    pub id: String,
    pub name_id: Option<String>,
    pub display_name: String,
    pub level: Option<u16>,
    pub np_level: Option<u8>,
    pub ascension_stage: Option<u8>,
    pub skill_levels: [Option<u8>; 3],
}
