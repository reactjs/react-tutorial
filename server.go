package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
)

type comment struct {
	Author string `json:"author"`
	Text   string `json:"text"`
}

const dataFile = "./_comments.json"

var commentMutex = new(sync.Mutex)

// Handle comments
func handleComments(w http.ResponseWriter, r *http.Request) {
	// Since multiple requests could come in at once, ensure we have a lock
	// around all file operations
	commentMutex.Lock()
	defer commentMutex.Unlock()

	// Stat the file, so we can find it's current permissions
	fi, err := os.Stat(dataFile)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to stat data file (%s): %s", dataFile, err), http.StatusInternalServerError)
		return
	}

	// Open the file Read/Write
	cFile, err := os.OpenFile(dataFile, os.O_RDWR, fi.Mode())
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to open data file (%s): %s", dataFile, err), http.StatusInternalServerError)
		return
	}
	defer cFile.Close() //Ensure the file is closed when we are done.

	switch r.Method {
	case "POST":
		// Decode the JSON data
		comments := make([]comment, 0)
		commentsDecoder := json.NewDecoder(cFile)
		if err := commentsDecoder.Decode(&comments); err != nil {
			http.Error(w, fmt.Sprintf("Unable to read comments from data file (%s): %s", dataFile, err), http.StatusInternalServerError)
			return
		}

		// Add a new comment to the in memory slice of comments
		comments = append(comments, comment{Author: r.FormValue("author"), Text: r.FormValue("text")})

		// Truncate the file and Seek to the beginning of it
		if err := cFile.Truncate(0); err != nil {
			http.Error(w, fmt.Sprintf("Unable to truncate data file (%s): %s", dataFile, err), http.StatusInternalServerError)
			return
		}
		if r, err := cFile.Seek(0, 0); r != 0 && err != nil {
			http.Error(w, fmt.Sprintf("Unable to seek to beginning of data file (%s): %s", dataFile, err), http.StatusInternalServerError)
			return
		}

		// Write out the json response
		commentsEncoder := json.NewEncoder(cFile)
		commentsEncoder.Encode(comments)

	case "GET":
		// stream the contents of the file to the response
		io.Copy(w, cFile)

	default:
		// Don't know the method, so error
		http.Error(w, fmt.Sprintf("Unsupported method: %s", r.Method), http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/comments.json", handleComments)
	http.Handle("/", http.FileServer(http.Dir("./public")))
	log.Fatal(http.ListenAndServe(":3000", nil))
}
