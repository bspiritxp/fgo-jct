use fgo_adapters::demo::create_application;
use fgo_core::domain::names::MatchKind;

#[test]
fn demo_keeps_owned_copies_and_contract_fields() {
    let application = create_application().unwrap();
    let workspace = application.load_workspace().unwrap();
    assert_eq!(workspace.servants.len(), 2);
    assert_eq!(workspace.servants[0].name_id, workspace.servants[1].name_id);
    assert_ne!(workspace.servants[0].id, workspace.servants[1].id);
    assert!(!workspace.agent.available);
    let value = serde_json::to_value(workspace).unwrap();
    let expected: serde_json::Value =
        serde_json::from_str(include_str!("../../../tests/fixtures/demo/workspace.json")).unwrap();
    assert_eq!(value, expected);
    let result = application.search_names("示例从者".into()).unwrap();
    assert_eq!(result.match_kind, MatchKind::Exact);
    assert_eq!(result.candidates.len(), 2);
    assert!(application.search_names("名".repeat(201)).is_err());
}
