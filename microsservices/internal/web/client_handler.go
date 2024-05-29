package web

import (
	"encoding/json"
	"net/http"

	"github.com/pedropereiraassis/full-cycle/microsservices/internal/usecase/create_client"
)

type WebClientHandler struct {
	CreateClientUseCase create_client.CreateClientUseCase
}

func NewWebClientHandler(createClientUseCase create_client.CreateClientUseCase) *WebClientHandler {
	return &WebClientHandler{
		CreateClientUseCase: createClientUseCase,
	}
}

func (h *WebClientHandler) CreateClient(w http.ResponseWriter, r *http.Request) {
	var inputDto create_client.CreateClientInputDTO
	err := json.NewDecoder(r.Body).Decode(&inputDto)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	output, err := h.CreateClientUseCase.Execute(inputDto)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
