import { Response } from "express";
import { Request, runWith } from "firebase-functions";

const goVCSBase: string = "https://github.com/jlucktay" as const;

export const goPackage = runWith({ memory: "128MB" }).https.onRequest(
  myHandler,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is the signature accepted by 'onRequest'.
export function myHandler(req: Request, resp: Response<any>): void {
  const firstSlash = req.path.substring(1).indexOf("/");
  let basePackage = req.path;

  if (firstSlash > 0) {
    basePackage = req.path.substring(0, firstSlash + 1);
  }

  // https://golang.org/cmd/go/#hdr-Remote_import_paths
  // <meta name="go-import" content="import-prefix vcs repo-root">
  const goImport: string[] = [
    /* import-prefix */ req.hostname + basePackage,
    /* vcs */ "git",
    /* repo-root */ goVCSBase + basePackage,
  ];

  const goImportMeta =
    `<meta name="go-import" content="` + goImport.join(" ") + `">`;

  // https://github.com/golang/gddo/wiki/Source-Code-Links
  // <meta name="go-source" content="prefix home directory file">
  const goSource: string[] = [
    /* prefix */ req.hostname + basePackage,
    /* home */ goVCSBase + basePackage,
    /* directory */ goVCSBase + basePackage + "/tree/main{/dir}",
    /* file */ goVCSBase + basePackage + "/tree/main{/dir}/{file}#L{line}",
  ];

  const goSourceMeta =
    `<meta name="go-source" content="` + goSource.join(" ") + `">`;

  resp.send(goImportMeta + "\n" + goSourceMeta + "\n");
}
