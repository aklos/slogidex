use crate::types::{IoOptions, ScriptError, ScriptOptions, ScriptResult};
use fsio;
use fsio::types::FsIOResult;
use std::env::current_dir;
use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::process::{Child, Command, Stdio};

/// Creates a command builder for the given input.
fn create_command_builder(
    command_string: &str,
    args: &Vec<String>,
    options: &ScriptOptions,
    need_permissions: bool
) -> Command {
    let mut command = match need_permissions {
        true => match cfg!(target_os = "linux") {
            true => Command::new("pkexec"),
            false => Command::new("osascript"),
        },
        false => Command::new(&command_string),
    };
    
    if need_permissions == true {
        if cfg!(target_os = "macos") {
            command.arg("-e");
            command.arg(format!(r#"do shell script \"{}\" with administrator privileges"#, &command_string));            
        } else {
            command.arg(&command_string);
        }
    }

    println!("{:?}", command);
    
    // let mut command = Command::new(&command_string);
    // let mut command = Command::new(file);

    if options.env_vars.is_some() {
        command.envs(options.env_vars.as_ref().unwrap());
    }
    
    for arg in args.iter() {
        println!("ARG: {:?}", arg);
        command.arg(arg);
    }

    match options.input_redirection {
        IoOptions::Null => command.stdin(Stdio::null()),
        IoOptions::Inherit => command.stdin(Stdio::inherit()),
        IoOptions::Pipe => command.stdin(Stdio::piped()),
    };

    match options.output_redirection {
        IoOptions::Null => command.stdout(Stdio::null()).stderr(Stdio::null()),
        IoOptions::Inherit => command.stdout(Stdio::inherit()).stderr(Stdio::inherit()),
        IoOptions::Pipe => command.stdout(Stdio::piped()).stderr(Stdio::piped()),
    };
    
    command
}

fn create_script_file(script: &String) -> FsIOResult<String> {
    let extension = if cfg!(windows) { "bat" } else { "sh" };
    let file_path = fsio::path::get_temporary_file_path(extension);
    
    match fsio::file::write_text_file(&file_path, script) {
        Ok(_) => Ok(file_path),
        Err(error) => {
            fsio::file::delete_ignore_error(&file_path);

            Err(error)
        }
    }
}

fn fix_path(path_string: &str) -> String {
    if cfg!(windows) {
        fsio::path::canonicalize_or(&path_string, &path_string)
    } else {
        path_string.to_string()
    }
}

fn modify_script(script: &String, options: &ScriptOptions) -> ScriptResult<String> {
    match current_dir() {
        Ok(cwd_holder) => {
            match cwd_holder.to_str() {
                Some(_) => {
                    // NOTE: Commented out addition of sh lines to the scripts.
                    // For some reason the author adds `cd ~` or equivalent

                    // let cwd_string = fix_path(cwd);

                    // create cd command
                    // let mut cd_command = "cd \"".to_string();
                    // cd_command.push_str(&cwd_string);
                    // cd_command.push('"');
                    // if let Some(ref working_directory) = options.working_directory {
                    //     cd_command.push_str(" && cd \"");
                    //     let working_directory_string: String =
                    //         FromPath::from_path(&working_directory);
                    //     cd_command.push_str(&working_directory_string);
                    //     cd_command.push('"');
                    // }

                    let mut script_lines: Vec<String> = script
                        .trim()
                        .split("\n")
                        .map(|string| string.to_string())
                        .collect();

                    // check if first line is shebang line
                    // let mut insert_index =
                    //     if script_lines.len() > 0 && script_lines[0].starts_with("#!") {
                    //         1
                    //     } else {
                    //         0
                    //     };

                    // if !cfg!(windows) {
                    //     if options.exit_on_error {
                    //         script_lines.insert(insert_index, "set -e".to_string());
                    //         insert_index = insert_index + 1;
                    //     }

                    //     if options.print_commands {
                    //         script_lines.insert(insert_index, "set -x".to_string());
                    //         insert_index = insert_index + 1;
                    //     }
                    // }

                    // script_lines.insert(insert_index, cd_command);

                    script_lines.push("\n".to_string());

                    let updated_script = script_lines.join("\n");
                    
                    Ok(updated_script)
                }
                None => Err(ScriptError::Description(
                    "Unable to extract current working directory path.",
                )),
            }
        }
        Err(error) => Err(ScriptError::IOError(error)),
    }
}

/// Invokes the provided script content and returns a process handle.
fn spawn_script(
    script: &str,
    args: &Vec<String>,
    options: &ScriptOptions,
) -> ScriptResult<(Child, String)> {
    match modify_script(&script.to_string(), &options) {
        Ok(updated_script) => match create_script_file(&updated_script) {
            Ok(file) => {
                // NOTE: Make file executable
                fs::set_permissions(&file, fs::Permissions::from_mode(0o550)).unwrap();

                let command = match options.runner {
                    Some(ref value) => value,
                    None => {
                        if cfg!(windows) {
                            "cmd.exe"
                        } else {
                            &file
                        }
                    }
                };
                
                // FIXME: Broke Windows scripts by commenting this out
                // let mut all_args = if cfg!(windows) {
                //     let win_file = fix_path(&file);
                //     vec!["/C".to_string(), win_file]
                // } else {
                //     // vec!["-c".to_string(), file.to_string()]
                //     vec![]
                // };
                
                // all_args.extend(args.iter().cloned());
                
                let mut command = create_command_builder(&command, &args, &options, updated_script.contains("sudo"));
                println!("{:?}", command);

                let result = command.spawn();

                match result {
                    Ok(child) => Ok((child, file.clone())),
                    Err(error) => {
                        fsio::file::delete_ignore_error(&file);

                        Err(ScriptError::IOError(error))
                    }
                }
            }
            Err(error) => Err(ScriptError::FsIOError(error)),
        },
        Err(error) => Err(error),
    }
}

/// Invokes the provided script content and returns a process handle.
///
/// # Arguments
///
/// * `script` - The script content
/// * `args` - The script command line arguments
/// * `options` - Options provided to the script runner
pub(crate) fn spawn(
    script: &str,
    args: &Vec<String>,
    options: &ScriptOptions,
) -> ScriptResult<Child> {
    let result = spawn_script(script, &args, &options);

    match result {
        Ok((child, _)) => Ok(child),
        Err(error) => Err(error),
    }
}