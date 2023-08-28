package main

import (
	"io"
	"net/http"
	"net/url"

	wasmhttp "github.com/nlepage/go-wasm-http-server"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		upstream, err := url.JoinPath("http://localhost:4000", r.URL.Path)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		request, err := http.NewRequest(r.Method, upstream, r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		request.Header = r.Header
		client := &http.Client{}
		response, err := client.Do(request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		body, err := io.ReadAll(response.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(response.StatusCode)
		_, err = w.Write(body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})
	wasmhttp.Serve(mux)
	select {}
}
