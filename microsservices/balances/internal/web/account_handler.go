package web

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/usecase/get_account_balance"
)

type WebAccountHandler struct {
	GetAccountBalanceUseCase get_account_balance.GetAccountBalanceUseCase
}

func NewWebAccountHandler(getAccountBalanceUseCase get_account_balance.GetAccountBalanceUseCase) *WebAccountHandler {
	return &WebAccountHandler{
		GetAccountBalanceUseCase: getAccountBalanceUseCase,
	}
}

func (h *WebAccountHandler) GetAccountBalance(w http.ResponseWriter, r *http.Request) {
	var dto get_account_balance.GetAccountBalanceInputDTO
	accountId := chi.URLParam(r, "accountId")
	if accountId == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("accountId is required")
		return
	}
	dto.AccountID = accountId

	output, err := h.GetAccountBalanceUseCase.Execute(dto)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
