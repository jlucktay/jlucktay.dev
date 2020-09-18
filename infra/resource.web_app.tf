resource "google_firebase_web_app" "basic" {
  provider = google-beta

  project = google_firebase_project.jlucktay_dev.id

  display_name = "value"
}

# terraform import -provider=google-beta google_firebase_web_app.basic jlucktay-dev
