#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, Window};

mod scripts;
mod types;
mod runner;

#[tauri::command]
async fn run_script(window: Window, invoke_message: String) {
    println!("run_script: {}", invoke_message);
    
    let data: scripts::RunScriptJSON = match serde_json::from_str(&invoke_message) {
        Ok(v) => v,
        Err(_) => return,
    };

    scripts::run(data, window).await;
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .setup(|app| {
            app.listen_global("init", |event| {
                println!("init event: {:?}", event.payload());
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![run_script])
        .run(context)
        .expect("error while running tauri application");
}
