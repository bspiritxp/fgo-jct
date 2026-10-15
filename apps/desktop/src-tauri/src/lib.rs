mod commands;

use std::sync::Arc;

pub fn run() {
    // Composition root: replace adapters here, not inside commands or core use cases.
    let application =
        fgo_adapters::demo::create_application().expect("embedded demo fixtures must be valid");
    tauri::Builder::default()
        .manage(Arc::new(application))
        .invoke_handler(tauri::generate_handler![
            commands::load_workspace,
            commands::search_names
        ])
        .run(tauri::generate_context!())
        .expect("failed to start FGO desktop host");
}
