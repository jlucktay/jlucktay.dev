use worker::{Context, Env, Headers, Request, Response, Result, Url, event};

use url::Host::Domain;

use std::borrow::Cow;

#[event(fetch)]
async fn fetch(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    console_error_panic_hook::set_once();

    const GO_VCS_BASE: &str = "https://github.com/jlucktay/";
    const NEWLINE: char = '\n';

    // Start building up a string for the response body.
    let mut body: String = String::new();

    let host: String = req.url()?.host().unwrap_or(Domain("localhost")).to_string();

    // This segment of HTML will always be sent in the response body, no matter the parameters of the request.
    let start_of_body: String = format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{host} — Go module vanity import path</title>
<style>
* {{ font-family: sans-serif; }}
body {{ margin-top: 0; }}
.content {{ display: inline-block; }}
code {{ display: block; font-family: monospace; font-size: 1em; background-color: #f0b04e; padding: 1em; margin-bottom: 16px; }}
ul {{ margin-top: 16px; margin-bottom: 16px; }}
</style>
"#,
        host = host
    );
    body.push_str(start_of_body.as_str());

    // This header will always be sent in the response.
    let headers: Headers = Headers::new();
    headers.append("Content-Type", "text/html; charset=utf-8")?;

    // Break down the request path to see if a package was requested, or if just the base domain was hit.
    let req_path: String = req.path().clone();
    let base_package: &str = req_path.split("/").nth(1).unwrap_or("");

    if base_package.len() == 0 {
        // No package was requested, so return early with a minimal response.
        let rest_of_body: String = format!(
            r#"</head>
<body>
<h2>{host}</h2>
</body>
</html>
"#,
            host = host
        );
        body.push_str(rest_of_body.as_str());

        return Ok(Response::ok(body)?.with_headers(headers));
    }

    // Check request's query paramaeters for a count of 'go-get=1'.
    let qp_url: Url = req.url()?.clone();
    let qp_go_get: usize = qp_url
        .query_pairs()
        .filter(|q: &(Cow<'_, str>, Cow<'_, str>)| q.0 == "go-get" && q.1 == "1")
        .count();

    // This prefix is used in both Go meta tags.
    let prefix: String = format!("{}/{}", host, base_package);

    // These values only appear in the 'go-import' meta tag.
    const VCS: &str = "git";
    let repo_root: String = format!("{}{}", GO_VCS_BASE, base_package);

    // https://golang.org/cmd/go/#hdr-Remote_import_paths
    // <meta name="go-import" content="import-prefix vcs repo-root">
    let go_import: String = format!(
        r#"<meta name="go-import" content="{import_prefix} {vcs} {repo_root}">{}"#,
        NEWLINE,
        import_prefix = prefix,
        vcs = VCS,
        repo_root = repo_root,
    );
    body.push_str(go_import.as_str());

    // These values only appear in the 'go-source' meta tag.
    let home: String = format!("{}{}", GO_VCS_BASE, base_package);
    let directory: String = format!("{}/tree/main{{/dir}}", home);
    let file: String = format!("{}/{{file}}#L{{line}}", directory);

    // https://github.com/golang/gddo/wiki/Source-Code-Links
    // <meta name="go-source" content="prefix home directory file">
    let go_source: String = format!(
        r#"<meta name="go-source" content="{prefix} {home} {directory} {file}">{}"#,
        NEWLINE,
        prefix = prefix,
        home = home,
        directory = directory,
        file = file,
    );
    body.push_str(go_source.as_str());

    // Continue building out the response body, with some package info, links, and styling.
    let middle_body: String = format!(
        r#"</head>
<body>
<div class="content">
<h2>{host}{path}</h2>
<code>go get {host}{path}</code>
<code>import "{host}{path}"</code>
Home: <a href="https://pkg.go.dev/{host}{path}">https://pkg.go.dev/{host}{path}</a><br>
Source: <a href="{go_vcs_base}{base_package}">{go_vcs_base}{base_package}</a><br>
"#,
        base_package = base_package,
        go_vcs_base = GO_VCS_BASE,
        host = host,
        path = req.path(),
    );
    body.push_str(middle_body.as_str());

    // If 'go-get=1' was not set as a query parameter, set a 'Refresh' header to redirect the browser, and add a warning to the response body.
    if qp_go_get == 0 {
        let refresh_header_value: String = format!(
            "30; url=https://pkg.go.dev/{host}{path}",
            host = host,
            path = req.path()
        );
        headers.append("Refresh", refresh_header_value.as_str())?;

        let refresh_warning: String = format!(
            r#"<br>
Redirecting you to the <a href="{go_vcs_base}{base_package}">project page</a>...
"#,
            base_package = base_package,
            go_vcs_base = GO_VCS_BASE,
        );
        body.push_str(refresh_warning.as_str());
    }

    // Finish building the body of the response and return.
    let rest_of_body: &str = r#"</div>
</body>
</html>
"#;
    body.push_str(rest_of_body);

    Ok(Response::ok(body)?.with_headers(headers))
}
