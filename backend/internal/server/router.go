package server

import (
	"encoding/json"
	"log"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/Boyeep/flippy-backend/internal/config"
	httpHandler "github.com/Boyeep/flippy-backend/internal/handler/http"
	"github.com/Boyeep/flippy-backend/internal/repository"
	"github.com/Boyeep/flippy-backend/internal/service"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(cfg config.Config, db *pgxpool.Pool) http.Handler {
	mux := http.NewServeMux()

	userRepository := repository.NewUserRepository(db)
	flashcardSetRepository := repository.NewFlashcardSetRepository(db)
	flashcardRepository := repository.NewFlashcardRepository(db)

	healthService := service.NewHealthService(cfg, db)
	courseService := service.NewCourseService()
	authService := service.NewAuthService(cfg, userRepository)
	analyticsService := service.NewAnalyticsService(cfg)
	flashcardSetService := service.NewFlashcardSetService(flashcardSetRepository)
	flashcardService := service.NewFlashcardService(flashcardRepository)

	healthHandler := httpHandler.NewHealthHandler(healthService)
	courseHandler := httpHandler.NewCourseHandler(courseService)
	authHandler := httpHandler.NewAuthHandler(authService)
	analyticsHandler := httpHandler.NewAnalyticsHandler(analyticsService)
	flashcardSetHandler := httpHandler.NewFlashcardSetHandler(flashcardSetService)
	flashcardHandler := httpHandler.NewFlashcardHandler(flashcardService)

	mux.HandleFunc("GET /health", healthHandler.Get)
	mux.HandleFunc("GET /api/v1/courses", courseHandler.List)
	mux.HandleFunc("POST /api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)
	mux.HandleFunc("POST /api/v1/auth/forgot-password", authHandler.ForgotPassword)
	mux.HandleFunc("POST /api/v1/auth/reset-password", authHandler.ResetPassword)
	mux.Handle("GET /api/v1/auth/me", authMiddleware(authService, http.HandlerFunc(authHandler.Me)))
	mux.Handle(
		"GET /api/v1/analytics/overview",
		authMiddleware(authService, ownerOnlyMiddleware(cfg, userRepository, http.HandlerFunc(analyticsHandler.Overview))),
	)
	mux.HandleFunc("GET /api/v1/flashcard-sets", flashcardSetHandler.List)
	mux.HandleFunc("GET /api/v1/flashcard-sets/{slug}", flashcardSetHandler.Get)
	mux.HandleFunc("GET /api/v1/flashcard-sets/{slug}/cards", flashcardHandler.ListBySet)
	mux.Handle("POST /api/v1/flashcard-sets", authMiddleware(authService, http.HandlerFunc(flashcardSetHandler.Create)))
	mux.Handle("PATCH /api/v1/flashcard-sets/{slug}", authMiddleware(authService, http.HandlerFunc(flashcardSetHandler.Update)))
	mux.Handle("DELETE /api/v1/flashcard-sets/{slug}", authMiddleware(authService, http.HandlerFunc(flashcardSetHandler.Delete)))
	mux.Handle("POST /api/v1/flashcard-sets/{slug}/cards", authMiddleware(authService, http.HandlerFunc(flashcardHandler.Create)))
	mux.Handle("PATCH /api/v1/flashcards/{id}", authMiddleware(authService, http.HandlerFunc(flashcardHandler.Update)))
	mux.Handle("DELETE /api/v1/flashcards/{id}", authMiddleware(authService, http.HandlerFunc(flashcardHandler.Delete)))

	return withCORS(cfg, withLogging(mux))
}

func ownerOnlyMiddleware(cfg config.Config, users repository.UserRepository, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if cfg.Analytics.DashboardOwnerEmail == "" {
			httpHandler.WriteErrorPublic(w, http.StatusForbidden, "dashboard owner email is not configured")
			return
		}

		userID, ok := httpHandler.UserIDFromContext(r.Context())
		if !ok {
			httpHandler.WriteErrorPublic(w, http.StatusUnauthorized, "missing authenticated user")
			return
		}

		user, err := users.FindByID(r.Context(), userID)
		if err != nil {
			httpHandler.WriteErrorPublic(w, http.StatusUnauthorized, "user no longer exists")
			return
		}

		if strings.ToLower(strings.TrimSpace(user.Email)) != cfg.Analytics.DashboardOwnerEmail {
			httpHandler.WriteErrorPublic(w, http.StatusForbidden, "dashboard access is restricted")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}

func withCORS(cfg config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := strings.TrimSpace(r.Header.Get("Origin"))
		if origin != "" && slices.Contains(cfg.App.CORS.AllowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func authMiddleware(authService service.AuthService, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(httpHandler.ErrorResponse{Error: "missing authorization header"})
			return
		}

		const prefix = "Bearer "
		if !strings.HasPrefix(authHeader, prefix) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(httpHandler.ErrorResponse{Error: "invalid authorization scheme"})
			return
		}

		userID, err := authService.ParseAccessToken(strings.TrimPrefix(authHeader, prefix))
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			_ = json.NewEncoder(w).Encode(httpHandler.ErrorResponse{Error: "invalid access token"})
			return
		}

		next.ServeHTTP(w, r.WithContext(httpHandler.ContextWithUserID(r.Context(), userID)))
	})
}
