provider "google-beta" {
  credentials = file("credentials.json")
  version     = "~> 3.31"
}
