use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NameEntry {
    pub id: String,
    pub name_zh: String,
    pub name_ja: String,
}

#[derive(Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum MatchKind {
    Empty,
    Exact,
    Suggested,
    None,
}

/// Candidate search only. Even exact matches do not identify an owned instance.
/// Initial normalization deliberately only trims whitespace; preserve meaningful suffixes.
pub fn find_candidates(query: &str, entries: &[NameEntry]) -> (MatchKind, Vec<NameEntry>) {
    let query = query.trim();
    if query.is_empty() {
        return (MatchKind::Empty, vec![]);
    }
    let exact: Vec<_> = entries
        .iter()
        .filter(|entry| entry.name_zh == query || entry.name_ja == query)
        .cloned()
        .collect();
    if !exact.is_empty() {
        return (MatchKind::Exact, exact);
    }
    let suggested: Vec<_> = entries
        .iter()
        .filter(|entry| entry.name_zh.contains(query) || entry.name_ja.contains(query))
        .cloned()
        .collect();
    if suggested.is_empty() {
        (MatchKind::None, suggested)
    } else {
        (MatchKind::Suggested, suggested)
    }
}
