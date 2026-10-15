/// Minimal reusable COST rule. Special quest rules belong in a later rule provider.
#[derive(Debug, Clone, Copy)]
pub enum SlotCost {
    Empty,
    Support,
    Owned {
        servant: Option<u16>,
        equipment: EquipmentCost,
    },
}

#[derive(Debug, Clone, Copy)]
pub enum EquipmentCost {
    Unequipped,
    Equipped(Option<u16>),
}

#[derive(Debug, PartialEq, Eq)]
pub enum CostStatus {
    Passed,
    Exceeded,
    Unknown,
}

#[derive(Debug, PartialEq, Eq)]
pub struct CostEvaluation {
    pub total: Option<u32>,
    pub limit: Option<u16>,
    pub status: CostStatus,
}

pub fn evaluate_cost(slots: &[SlotCost; 6], limit: Option<u16>) -> CostEvaluation {
    let total = slots.iter().try_fold(0_u32, |total, slot| {
        let cost = match slot {
            SlotCost::Empty | SlotCost::Support => Some(0),
            SlotCost::Owned { servant, equipment } => {
                let equipment = match equipment {
                    EquipmentCost::Unequipped => Some(0),
                    EquipmentCost::Equipped(cost) => *cost,
                };
                servant
                    .zip(equipment)
                    .map(|(s, e)| u32::from(s) + u32::from(e))
            }
        };
        cost.map(|cost| total + cost)
    });
    let status = match (total, limit) {
        (Some(total), Some(limit)) if total > u32::from(limit) => CostStatus::Exceeded,
        (Some(_), Some(_)) => CostStatus::Passed,
        _ => CostStatus::Unknown,
    };
    CostEvaluation {
        total,
        limit,
        status,
    }
}
