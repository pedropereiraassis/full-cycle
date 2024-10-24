package main

import (
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var onlineUsers = prometheus.NewGauge(prometheus.GaugeOpts{
	Name: "goapp_online_users",
	Help: "Online users",
	ConstLabels: map[string]string{
		"website": "ecommerce",
	},
})

var httpRequestsTotal = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "goapp_http_requests_total",
	Help: "Count of all HTTP requests for goapp",
}, []string{})

var httpRequestsDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name: "goapp_http_requests_duration",
	Help: "Duration in seconds of all HTTP requests for goapp",
}, []string{"handler"})

func main() {
	r := prometheus.NewRegistry()
	r.MustRegister(onlineUsers)
	r.MustRegister(httpRequestsTotal)
	r.MustRegister(httpRequestsDuration)

	go func() {
		for {
			onlineUsers.Set(float64(rand.Intn(2000)))
		}
	}()

	home := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(time.Duration(rand.Intn(5)) * time.Second)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Hello, World!"))
	})

	contact := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(time.Duration(rand.Intn(6)) * time.Second)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Hello, Contact!"))
	})

	d := promhttp.InstrumentHandlerDuration(
		httpRequestsDuration.MustCurryWith(prometheus.Labels{"handler": "home"}),
		promhttp.InstrumentHandlerCounter(httpRequestsTotal, home),
	)

	d2 := promhttp.InstrumentHandlerDuration(
		httpRequestsDuration.MustCurryWith(prometheus.Labels{"handler": "contact"}),
		promhttp.InstrumentHandlerCounter(httpRequestsTotal, contact),
	)

	http.HandleFunc("/", d)
	http.HandleFunc("/contact", d2)

	http.Handle("/metrics", promhttp.HandlerFor(r, promhttp.HandlerOpts{}))

	log.Fatal(http.ListenAndServe(":8181", nil))
}
