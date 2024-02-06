import { runWith } from "firebase-functions";
import { Logging } from "@google-cloud/logging";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const goVCSBase = "https://github.com/jlucktay";

export const goPackage = runWith({ memory: "128MB" }).https.onRequest(
  (request, response) => {
    const logging = new Logging();
    const log = logging.log("goPackage");

    const METADATA = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "goPackage" },
      },
    };

    const firstSlash = request.path.substring(1).indexOf("/");
    let basePackage = request.path;

    if (firstSlash > 0) {
      basePackage = request.path.substring(0, firstSlash + 1);
    }

    // https://golang.org/cmd/go/#hdr-Remote_import_paths
    // <meta name="go-import" content="import-prefix vcs repo-root">
    const goImport: string[] = [
      /* import-prefix */ request.hostname + basePackage,
      /* vcs */ "git",
      /* repo-root */ goVCSBase + basePackage,
    ];

    const goImportMeta =
      `<meta name="go-import" content="` + goImport.join(" ") + `">`;

    const logGoImportMeta = { message: goImportMeta };
    log.write(log.entry(METADATA, logGoImportMeta));

    // https://github.com/golang/gddo/wiki/Source-Code-Links
    // <meta name="go-source" content="prefix home directory file">
    const goSource: string[] = [
      /* prefix */ request.hostname + basePackage,
      /* home */ goVCSBase + basePackage,
      /* directory */ goVCSBase + basePackage + "/tree/main{/dir}",
      /* file */ goVCSBase + basePackage + "/tree/main{/dir}/{file}#L{line}",
    ];

    const goSourceMeta =
      `<meta name="go-source" content="` + goSource.join(" ") + `">`;

    const logGoSourceMeta = { message: goSourceMeta };
    log.write(log.entry(METADATA, logGoSourceMeta));

    response.send(goImportMeta + "\n" + goSourceMeta + "\n");
  },
);
