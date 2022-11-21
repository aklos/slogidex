use crate::{runner::spawn, types::IoOptions, types::ScriptOptions};
use serde::{Deserialize, Serialize};
use std::io::{BufRead, BufReader};
use tauri::Window;

#[derive(Deserialize, Serialize, Debug)]
pub struct RunScriptJSON {
    id: String,
    instanceId: String,
    args: String,
    script: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ScriptOutput {
    id: String,
    instanceId: String,
    output: String,
    error: bool,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

pub async fn run(data: RunScriptJSON, window: Window) {
    let mut options = ScriptOptions::new();
    options.input_redirection = IoOptions::Pipe;

    let args: Vec<String> = data.args.split("!").map(|s| s.to_string()).collect();
    
    // if (args.len() > 1) {
    //     args.remove(0);
    // }

    let mut child = spawn(&data.script, &args, &options).unwrap();

    {
        let stdout = child.stdout.as_mut().unwrap();
        let stdout_reader = BufReader::new(stdout);
        let stdout_lines = stdout_reader.lines();

        for line in stdout_lines {
            let line_str = line.unwrap();
            println!("Read: {}", line_str);

            let output = ScriptOutput {
                id: data.id.clone(),
                instanceId: data.instanceId.clone(),
                output: line_str,
                error: false,
            };

            let output_str = serde_json::to_string(&output).unwrap();

            window
                .emit(
                    "script-output",
                    Payload {
                        message: output_str,
                    },
                )
                .unwrap();
        }

        let stderr = child.stderr.as_mut().unwrap();
        let stderr_reader = BufReader::new(stderr);
        let stderr_lines = stderr_reader.lines();

        for line in stderr_lines {
            let line_str = line.unwrap();
            println!("ERROR Read: {}", line_str);

            let output = ScriptOutput {
                id: data.id.clone(),
                instanceId: data.instanceId.clone(),
                output: line_str,
                error: false,
            };

            let output_str = serde_json::to_string(&output).unwrap();

            window
                .emit(
                    "script-output",
                    Payload {
                        message: output_str,
                    },
                )
                .unwrap();
        }
    }

    // let final_output = ScriptOutput {
    //     id: data.id.clone(),
    //     instanceId: data.instanceId.clone(),
    //     output: "__finished__".to_string(),
    //     error: false,
    // };

    // let final_output_str = serde_json::to_string(&final_output).unwrap();

    // window
    //     .emit(
    //         "script-output",
    //         Payload {
    //             message: final_output_str,
    //         },
    //     )
    //     .unwrap();

    let ecode = child.wait().unwrap();

    if ecode.success() {
        let final_output = ScriptOutput {
            id: data.id.clone(),
            instanceId: data.instanceId.clone(),
            output: "__finished__".to_string(),
            error: false,
        };

        let final_output_str = serde_json::to_string(&final_output).unwrap();

        window
            .emit(
                "script-output",
                Payload {
                    message: final_output_str,
                },
            )
            .unwrap();
    } else {
        let final_output = ScriptOutput {
            id: data.id.clone(),
            instanceId: data.instanceId.clone(),
            output: "__finished__".to_string(),
            error: true,
        };

        let final_output_str = serde_json::to_string(&final_output).unwrap();

        window
            .emit(
                "script-output",
                Payload {
                    message: final_output_str,
                },
            )
            .unwrap();
    }
}

