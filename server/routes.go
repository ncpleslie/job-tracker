package server

import (
	"encoding/json"

	"fmt"
	"net/http"

	"github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
	"github.com/ncpleslie/application-tracker/services"
)

// addRoutes adds the routes to the provided http.ServeMux.
func addRoutes(
	mux *http.ServeMux,
	jobService *services.JobService,
) {
	mux.Handle("GET /jobs/{userId}", handleAllJobsGet(jobService))
	mux.Handle("GET /job/{userId}/{jobId}", handleJobGet(jobService))
	mux.Handle("POST /job/{userId}", handleCreateJobPost(jobService))
	mux.Handle("GET /healthz", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	mux.Handle("/", http.NotFoundHandler())
}

func handleJobGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// key := r.PathValue("key")

		// value, err := kvService.Get(key)
		// if err != nil {
		// 	encode(w, r, http.StatusNotFound, models.KVErrorResponse{Error: fmt.Sprintf("key '%s' not found", key)})

		// 	return
		// }

		// encode(w, r, http.StatusOK, models.KVResponse{Key: key, Value: value.(string)})
	}
}

// Returns a handler function for the GET /{key} route.
// It retrieves all jobs for the provided user ID from the JobService.
//
// GET /job/{userId}
func handleAllJobsGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// key := r.PathValue("key")

		// value, err := kvService.Get(key)
		// if err != nil {
		// 	encode(w, r, http.StatusNotFound, models.KVErrorResponse{Error: fmt.Sprintf("key '%s' not found", key)})

		// 	return
		// }

		// encode(w, r, http.StatusOK, models.KVResponse{Key: key, Value: value.(string)})
	}
}

// Returns a handler function for the POST /{key} route.
//
// POST /job/{userId}
func handleCreateJobPost(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// u, _ := url.Parse("https://www.linkedin.com/jobs/view/3843374200")

		userId := r.PathValue("userId")
		job, err := decode[requests.Job](r)
		if err != nil {
			encode(w, r, http.StatusBadRequest, responses.Error{Message: fmt.Sprintf("Error decoding request body. Error: %s", err.Error())})

			return
		}

		newJobErr := jobService.CreateNewJob(r.Context(), userId, job)
		if newJobErr != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error creating new job. Error: %s", newJobErr.Error())})

			return
		}

		encode(w, r, http.StatusCreated, responses.Success{Message: "Job created successfully"})
	}
}

// Writes the provided value to the http.ResponseWriter.
// It sets the status code and content type for the response.
// Will set content type to "application/json".
// It returns an error if the value cannot be encoded.
func encode[T any](w http.ResponseWriter, _ *http.Request, status int, v T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("encode json: %w", err)
	}

	return nil
}

// Decodes the request body into the provided value.
// It returns an error if the body cannot be decoded.
func decode[T any](r *http.Request) (T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}

	return v, nil
}