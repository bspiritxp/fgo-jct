use fgo_core::domain::{
    names::{find_candidates, MatchKind, NameEntry},
    team::{evaluate_cost, CostStatus, EquipmentCost, SlotCost},
};

#[test]
fn duplicate_names_stay_ambiguous_and_meaningful_suffixes_are_preserved() {
    let entries = vec![
        NameEntry {
            id: "a".into(),
            name_zh: "同名".into(),
            name_ja: "甲".into(),
        },
        NameEntry {
            id: "b".into(),
            name_zh: "同名".into(),
            name_ja: "乙".into(),
        },
        NameEntry {
            id: "c".into(),
            name_zh: "同名〔限定〕".into(),
            name_ja: "丙".into(),
        },
    ];
    let (kind, candidates) = find_candidates(" 同名 ", &entries);
    assert_eq!(kind, MatchKind::Exact);
    assert_eq!(candidates.len(), 2);
    assert_eq!(find_candidates("同名〔限定〕", &entries).1[0].id, "c");
    assert_eq!(find_candidates("乙", &entries).1[0].id, "b");
    assert_eq!(find_candidates("未知", &entries).0, MatchKind::None);
    assert_eq!(find_candidates(" ", &entries).0, MatchKind::Empty);
}

#[test]
fn cost_distinguishes_missing_data_from_unequipped_and_excludes_support() {
    let mut slots = [SlotCost::Empty; 6];
    slots[0] = SlotCost::Owned {
        servant: Some(16),
        equipment: EquipmentCost::Equipped(Some(12)),
    };
    slots[1] = SlotCost::Support;
    assert_eq!(evaluate_cost(&slots, Some(28)).status, CostStatus::Passed);
    assert_eq!(evaluate_cost(&slots, Some(27)).status, CostStatus::Exceeded);
    assert_eq!(evaluate_cost(&slots, None).status, CostStatus::Unknown);
    slots[0] = SlotCost::Owned {
        servant: Some(16),
        equipment: EquipmentCost::Equipped(None),
    };
    assert_eq!(evaluate_cost(&slots, Some(100)).total, None);
    slots[0] = SlotCost::Owned {
        servant: Some(16),
        equipment: EquipmentCost::Unequipped,
    };
    assert_eq!(evaluate_cost(&slots, Some(100)).total, Some(16));
}
