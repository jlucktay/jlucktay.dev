resource "google_firebase_project_location" "sydney" {
  provider = google-beta

  location_id = "australia-southeast1"
}

# terraform import -provider=google-beta google_firebase_project_location.sydney projects/jlucktay-dev
