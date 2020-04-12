import { https } from 'firebase-functions'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const go_vcs_base = "https://github.com/jlucktay"

export const goPackage = https.onRequest((request, response) => {
  const firstSlash = request.path.substring(1).indexOf("/")
  let basePackage = request.path

  if (firstSlash > 0) {
    basePackage = request.path.substring(0, firstSlash + 1)
  }

  // https://golang.org/cmd/go/#hdr-Remote_import_paths
  // <meta name="go-import" content="import-prefix vcs repo-root">
  const goImport: string[] = [
    /* import-prefix */ request.hostname + basePackage,
    /* vcs */           "git",
    /* repo-root */     go_vcs_base + basePackage
  ]

  const goImportMeta = `<meta name="go-import" content="` + goImport.join(" ") + `">`

  // https://github.com/golang/gddo/wiki/Source-Code-Links
  // <meta name="go-source" content="prefix home directory file">
  const goSource: string[] = [
    /* prefix */    request.hostname + basePackage,
    /* home */      go_vcs_base + basePackage,
    /* directory */ go_vcs_base + basePackage + "/tree/master{/dir}",
    /* file */      go_vcs_base + basePackage + "/tree/master{/dir}/{file}#L{line}",
  ]

  const goSourceMeta = `<meta name="go-source" content="` + goSource.join(" ") + `">`

  response.send(goImportMeta + "\n" + goSourceMeta + "\n")
})
