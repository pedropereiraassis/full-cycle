package web

import (
	"encoding/json"
	"net/http"

	"github.com/pedropereiraassis/full-cycle/microsservices/internal/usecase/create_account"
)

type WebAccountHandler struct {
	CreateAccountUseCase create_account.CreateAccountUseCase
}

func NewWebAccountHandler(createAccountUseCase create_account.CreateAccountUseCase) *WebAccountHandler {
	return &WebAccountHandler{
		CreateAccountUseCase: createAccountUseCase,
	}
}

func (h *WebAccountHandler) CreateAccount(w http.ResponseWriter, r *http.Request) {
	var inputDto create_account.CreateAccountInputDTO
	err := json.NewDecoder(r.Body).Decode(&inputDto)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	output, err := h.CreateAccountUseCase.Execute(inputDto)
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
